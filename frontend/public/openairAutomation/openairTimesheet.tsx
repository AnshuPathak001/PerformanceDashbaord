"use client"

import { useEffect, useState } from "react"
import { createParser } from "eventsource-parser"
import { useSession } from "next-auth/react";
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser"

export default function OpenAirAutomationBox() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [statement, setStatement] = useState("")
  const [status, setStatus] = useState("")
  const [twoFACode, setTwoFACode] = useState("")
  const [loader, setLoader] = useState(false)

  const { data: session } = useSession();
  useEffect(() => {
    if (!email && session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  const handleSubmit = async () => {
    setLoader(true)
    if (!statement) {
      setStatus("❌ Please describe your work.")
      setLoader(false)
      return
    }
    if (!email) {
      setStatus("❌ Please enter email.")
      setLoader(false)
      return
    }

    setStatus("⏳ Running automation...")
    setTwoFACode("")

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/openair/fill-timesheet-stream`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, statement }),
      })

      console.log("URL: ", url)

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      const parser = createParser((event) => {
        if ("data" in event) {
          const msg = event.data

          console.log("📥 Backend Stream:", msg)

          if (msg.startsWith("2FA:")) {
            const code = msg.replace("2FA:", "").trim()
            console.log("✅ Detected 2FA code from backend:", code)
            setTwoFACode(code)
            setStatus((prev) => prev + `\n🔐 2FA Code: ${code}`)
          } else if (msg.includes("✅ Timesheet submitted successfully")) {
            setStatus((prev) => prev + `\n✅ Timesheet submitted successfully.`)
          } else if (msg.includes("⚠️ Submission may have failed")) {
            setStatus((prev) => prev + `\n⚠️ Submission may needs manual check.`)
          } else if (msg === "DONE") {
            setStatus((prev) => prev + `\n✅ Automation finished. Now you can Save & Submit.`)
          } else {
            setStatus((prev) => prev + `\n${msg}`)
          }
        }
      })

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        parser.feed(decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      console.error(err)
      console.log("Error: ", err)
      setStatus("⏳ Please wait while it is running automation...")
      // setStatus("❌ Failed to call backend.")
    }
    finally {
      setLoader(false)
    }
  }

  const clearForm = () => {
    setStatement("")
    setStatus("")
    setTwoFACode("")
    setLoader(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            OpenAir Automation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill your Valtech timesheet using natural language + automation. Just describe your work and let AI handle the rest.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <span className="mr-2">📋</span>
              Timesheet Information
            </h2>
          </div>

          <div className="p-8 space-y-8">
            {/* Email Field */}
            <div className="space-y-3 mb-4">
              <label className="block text-sm font-semibold text-gray-700 flex items-center mb-2">
                <span className="mr-2">📧</span>
                Microsoft Email
              </label>
              <input
                type="email"
                placeholder="Enter your Microsoft email address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm transition-all duration-200 bg-gray-50 text-gray-900 dark:text-white dark:bg-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Work Description Field */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center mb-2">
                <span className="mr-2">📝</span>
                Current Week Work Description
              </label>
              <textarea
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm transition-all duration-200 bg-gray-50 text-gray-900 dark:text-white dark:bg-gray-800"
                placeholder="Example: I worked on AI CoE on Monday and Tuesday for 8 hours for Development task, sustainability project on Wed/Thu for 8 hrs on sustainability task and on Friday, I was on sick leave."
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-gray-500 flex items-center">
                <span className="mr-1">💡</span>
                Describe your work in natural language - mention days, hours, projects, and tasks
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loader}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loader ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Running Automation...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Run Automation
                  </div>
                )}
              </button>

              <button
                onClick={clearForm}
                disabled={loader}
                className="sm:flex-initial bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-2">🗑️</span>
                Clear Form
              </button>
            </div>
          </div>
        </div>

        {/* Status Display */}
        {status && (
          <div className="mt-8 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">📊</span>
                Automation Status
              </h3>
            </div>
            
            <div className="p-8">
              {twoFACode && (
                <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <div className="bg-amber-500 rounded-full p-2 mr-4">
                      <span className="text-white text-lg">🔐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 text-lg">2FA Code Generated</h4>
                      <p className="text-amber-700 text-2xl font-mono font-bold mt-1">{twoFACode}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-sm overflow-auto max-h-80">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-green-300 font-semibold">Live Status Feed</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">{status}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 text-lg mb-3 flex items-center">
            <span className="mr-2">❓</span>
            How to use this tool
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start">
              <span className="mr-2 mt-1">1️⃣</span>
              <p>Enter your Microsoft email address used for OpenAir login</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">2️⃣</span>
              <p>Describe your current weekly work in natural language</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">3️⃣</span>
              <p>Click "Run Automation" and wait for the process to complete</p>
            </div>
            <div className="flex items-start">
              <span className="mr-2 mt-1">4️⃣</span>
              <p>Use the 2FA code if prompted during authentication</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}