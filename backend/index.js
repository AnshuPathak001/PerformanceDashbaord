const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://pankajgandhi:PGsWGVaHdP09MtAs@valtechhackathon.rckutwb.mongodb.net/PerformaX?retryWrites=true&w=majority')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const loginUserSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: String,
}, { collection: 'loginusers' });

const LoginUser = mongoose.model('LoginUser', loginUserSchema);

// User endpoints
app.get('/users', async (req, res) => {
    try {
        const users = await LoginUser.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/users/:email', async (req, res) => {
    try {
        const user = await LoginUser.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Timesheet automation stream endpoint
app.post('/openair/fill-timesheet-stream', async (req, res) => {
    const { email, statement, password } = req.body;

    if (!email || !statement) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control, Content-Type',
        'X-Accel-Buffering': 'no'
    });

    const pythonScriptPath = path.join(__dirname, 'automation', 'openairTimesheet', 'python_integration.py');
    let isConnectionActive = true;
    let messageCount = 0;

    function sendSSE(data) {
        if (isConnectionActive) {
            try {
                messageCount++;
                console.log(`SSE Message ${messageCount}: ${data}`);
                res.write(`data: ${data}\n\n`);
                return true;
            } catch (error) {
                console.log('SSE write failed:', error.message);
                isConnectionActive = false;
                return false;
            }
        }
        return false;
    }

    sendSSE('Connection established successfully');

    try {
        const inputData = JSON.stringify({ email, statement, password: password || "" });
        console.log('Starting Python automation:', { 
            email, 
            statement: statement.substring(0, 50) + '...',
            scriptPath: pythonScriptPath
        });

        const pythonProcess = spawn('python', [
            pythonScriptPath,
            inputData
        ], {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { 
                ...process.env, 
                PYTHONUNBUFFERED: '1',
                PYTHONIOENCODING: 'utf-8',
                PYTHONDONTWRITEBYTECODE: '1'
            },
            cwd: __dirname,
            shell: false
        });

        console.log('Python process spawned, PID:', pythonProcess.pid);
        sendSSE('Python automation process started');

        let lineCount = 0;
        
        pythonProcess.stdout.setEncoding('utf8');
        pythonProcess.stderr.setEncoding('utf8');
        
        pythonProcess.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            lines.forEach((line) => {
                const trimmedLine = line.trim();
                if (trimmedLine) {
                    lineCount++;
                    sendSSE(trimmedLine);
                }
            });
        });

        pythonProcess.stderr.on('data', (data) => {
            const error = data.toString().trim();
            console.error('Python stderr:', error);
            if (error) {
                sendSSE(`Error: ${error}`);
            }
        });

        pythonProcess.on('close', (code, signal) => {
            console.log(`Python process finished: code=${code}, signal=${signal}, lines processed=${lineCount}`);
            if (code !== 0) {
                sendSSE(`Process ended with code: ${code}`);
            }
            sendSSE('DONE');

            setTimeout(() => {
                res.end();
                isConnectionActive = false;
            }, 1000);
        });

        req.on('close', () => {
            console.log('Client disconnected - keeping process alive');
        });

        req.on('aborted', () => {
            console.log('Request aborted by client');
            isConnectionActive = false;
        });

    } catch (error) {
        console.error('Error starting automation:', error);
        sendSSE(`Server Error: ${error.message}`);
        sendSSE('DONE');
        res.end();
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET  /users');
    console.log('  GET  /users/:email');
    console.log('  POST /openair/fill-timesheet-stream');
});
