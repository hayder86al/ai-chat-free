"use client"

import React, { useState } from "react"
import { MessageList } from "./MessageList"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getResponse } from "@/app/actions"

type Message = {
  id: number
  text: string
  sender: "user" | "bot"
}

const models = [
  {
    id: "llama-3.1-70b-versatile",
    name: "LLama3.1-70B",
  },
  {
    id: "llama3-8b-8192",
    name: "Llama3",
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma2",
  },
]

export function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Hayder's chatbot. How can I help you today?",
      sender: "bot",
    },
  ])
  const [model, setModel] = useState(models[0])
  const [input, setInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: input,
        sender: "user",
      }
      setMessages([...messages, newMessage])
      setInput("")
      const response = await getResponse({ input, model: model.id })
      const botResponse: Message = {
        id: Date.now(),
        text: response,
        sender: "bot",
      }
      setMessages(prevMessages => [...prevMessages, botResponse])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <>
      <div className="p-4 bg-white m-4 w-[30%] ">
        <h2 className="text-lg font-semibold">Select a model</h2>
        <select
          onChange={e => setModel(models.find(m => m.id === e.target.value)!)}
          value={model.id}
          className="w-full mt-2 p-2 border border-gray-300 rounded-md"
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col h-[80vh] max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="flex-grow overflow-auto mb-4">
          <MessageList messages={messages} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
            className="flex-grow resize-none"
            rows={3}
          />
          <Button type="submit" className="self-end">
            Send
          </Button>
        </form>
      </div>
    </>
  )
}
