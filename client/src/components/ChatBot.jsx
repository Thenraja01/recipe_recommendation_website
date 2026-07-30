import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  MessageSquare,
  Send,
  X,
  Loader2,
  BookOpen,
  ChefHat,
  Salad,
  Zap,
  Leaf,
  Beef,
  UserRound,
} from "lucide-react"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader } from "./ui/card"

import api from "../lib/api"
import { useAuth } from "../context/AuthContext"

const MODES = [
  { id: "default", label: "AI Chef", icon: ChefHat, color: "bg-green-600" },
  { id: "healthy", label: "Healthy", icon: Salad, color: "bg-emerald-600" },
  { id: "quick", label: "5-Min Cook", icon: Zap, color: "bg-yellow-500" },
  { id: "veg", label: "Veg", icon: Leaf, color: "bg-green-500" },
  { id: "nonveg", label: "Non-Veg", icon: Beef, color: "bg-red-500" },
  { id: "waiter", label: "Waiter", icon: UserRound, color: "bg-blue-600" },
]

function getSessionId() {
  let sid = localStorage.getItem("chatSessionId")
  if (!sid) {
    sid = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)
    localStorage.setItem("chatSessionId", sid)
  }
  return sid
}

export default function ChatBot() {
  const { isAuthenticated, user } = useAuth()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [mode, setMode] = useState("default")
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      type: "text",
      text: "👋 Hi! I'm your AI chef. Pick a mode below and ask me about any recipe or dish!",
    },
  ])

  useEffect(() => {
    const saved = localStorage.getItem("chatMessages")
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("chatMessages", JSON.stringify(messages.slice(-50)))
    }
  }, [messages])

  if (!isAuthenticated) return null

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const message = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { sender: "user", type: "text", text: message }])
    setLoading(true)

    try {
      const { data } = await api.post("/chat", {
        message,
        mode,
        sessionId: getSessionId(),
      })

      if (data.type === "blog") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "blog", blog: data.blog },
        ])
      } else if (data.type === "ai") {
        const recipeData = data.recipe?.recipe || data.recipe
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "ai", recipe: recipeData },
        ])
      } else if (data.type === "text") {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", type: "text", text: data.text },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "recipe",
            recipe: data.recipe || data,
          },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          text: err.response?.data?.message || "Something went wrong. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      sender: "bot",
      type: "text",
      text: "👋 Hi! I'm your AI chef. Pick a mode below and ask me about any recipe or dish!",
    }])
    localStorage.removeItem("chatMessages")
  }

  const currentMode = MODES.find((m) => m.id === mode) || MODES[0]

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full h-14 w-14 p-0 bg-green-600 hover:bg-green-700 shadow-xl"
        >
          <MessageSquare />
        </Button>
      )}

      {open && (
        <Card className="w-96 h-[640px] flex flex-col shadow-2xl">
          <CardHeader className={`${currentMode.color} text-white flex flex-row justify-between items-center p-4`}>
            <div className="flex items-center gap-2 font-bold">
              <currentMode.icon size={20} />
              <span>{currentMode.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} className="text-white/70 hover:text-white text-xs">
                Clear
              </button>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
          </CardHeader>

          <div className="flex gap-1 px-3 py-2 bg-gray-50 border-b overflow-x-auto">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  mode === m.id
                    ? `${m.color} text-white`
                    : "bg-white text-gray-600 border hover:bg-gray-100"
                }`}
              >
                <m.icon size={14} />
                {m.label}
              </button>
            ))}
          </div>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-xl p-3 ${
                  msg.sender === "user"
                    ? "bg-green-600 text-white ml-10"
                    : "bg-gray-100 mr-10"
                }`}
              >
                {msg.type === "text" && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}

                {msg.type === "blog" && msg.blog && (
                  <div>
                    <div className="flex items-center gap-2 font-bold text-green-700">
                      <BookOpen size={18} />
                      {msg.blog.title}
                    </div>
                    <p className="text-sm mt-2">{msg.blog.summary || msg.blog.content?.substring(0, 200)}</p>
                    <Link to={`/blog/${msg.blog.id}`}>
                      <Button className="mt-3 w-full text-xs" size="sm">Read Blog</Button>
                    </Link>
                  </div>
                )}

                {(msg.type === "recipe" || msg.type === "ai") && msg.recipe && (
                  <div>
                    <div className="flex items-center gap-2 font-bold text-green-700">
                      <ChefHat size={18} />
                      {msg.recipe.title || "Recipe"}
                    </div>
                    {msg.recipe.cuisine && (
                      <p className="text-xs text-gray-500 mt-1 italic">{msg.recipe.cuisine} cuisine</p>
                    )}
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      {msg.recipe.prepTime && <span>⏱ {msg.recipe.prepTime}m</span>}
                      {msg.recipe.servings && <span>🍽 {msg.recipe.servings} servings</span>}
                      {msg.recipe.difficulty && <span>📊 {msg.recipe.difficulty}</span>}
                    </div>
                    <p className="mt-2 text-sm font-semibold">Ingredients:</p>
                    <ul className="list-disc ml-5 text-sm">
                      {(msg.recipe.ingredients || []).map((item, i) => (
                        <li key={i}>{item.name || item}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm font-semibold">Instructions:</p>
                    <p className="text-sm whitespace-pre-wrap mt-1">{msg.recipe.instructions}</p>
                    {msg.recipe.tips && (
                      <p className="text-xs text-green-600 mt-2 italic">💡 {msg.recipe.tips}</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 text-gray-500 ml-3">
                <Loader2 className="animate-spin h-4 w-4" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </CardContent>

          <form onSubmit={sendMessage} className="border-t p-3 flex gap-2">
            <Input
              placeholder="Ask anything about food..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="rounded-xl"
            />
            <Button disabled={loading || !input.trim()} type="submit" className="rounded-xl">
              <Send size={18} />
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
