const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://pankajgandhi:PGsWGVaHdP09MtAs@valtechhackathon.rckutwb.mongodb.net/PerformaX?retryWrites=true&w=majority')
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const loginUserSchema = new mongoose.Schema({
  userName: String,
  password: String,
  email: String,
}, { collection: 'loginusers' }); // 👈 ensure collection name is exactly as in MongoDB

const LoginUser = mongoose.model('LoginUser', loginUserSchema);

app.get('/users', async (req, res) => {
  try {
    const users = await LoginUser.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.post('/users', async (req, res) => {
//   const { userName, password, email } = req.body;
//   if (!password) {
//     console.warn('⚠️ Warning: Password is missing!');
//   }
//   const user = new LoginUser({ userName, password, email });
//   await user.save();
//   res.json(user);
// });

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

app.listen(5000, () => console.log('Server started on http://localhost:5000'));
