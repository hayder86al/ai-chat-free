import React from "react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map(message => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        </div>
      ))}
    </div>
  )
}
