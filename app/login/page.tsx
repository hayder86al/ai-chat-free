"use client"
import React, { useState } from "react"
import { createSession } from "../actions"
import { useRouter } from "next/navigation"

function Login() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [error, setError] = useState("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle login logic here
    const resp = await createSession({
      userName: credentials.username,
      password: credentials.password,
    })
    if (resp.success) {
      setError("")
      router.push("/")
    } else {
      setError(resp.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>{error}</div>}

      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}

export default Login
