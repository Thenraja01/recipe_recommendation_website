import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Send,
  X,
  Loader2,
  BookOpen,
  ChefHat,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";

import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function ChatBot() {
  const { isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      type: "text",
      text: "👋 Hi! Ask me about any recipe or food. I'll first search your blogs, then recipes, then AI.",
    },
  ]);

  if (!isAuthenticated) return null;

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const message = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        type: "text",
        text: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat", {
        message,
      });

      if (data.type === "blog") {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "blog",
            blog: data.blog,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "recipe",
            recipe: data.recipe,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          text:
            err.response?.data?.message ||
            "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full h-14 w-14 p-0 bg-green-600 hover:bg-green-700"
        >
          <MessageSquare />
        </Button>
      )}

      {open && (
        <Card className="w-96 h-[600px] flex flex-col">

          <CardHeader className="bg-green-600 text-white flex flex-row justify-between items-center">

            <div className="font-bold">
              AI Food Assistant
            </div>

            <button onClick={() => setOpen(false)}>
              <X />
            </button>

          </CardHeader>

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

                {msg.type === "text" && (
                  <p>{msg.text}</p>
                )}

                {msg.type === "blog" && (
                  <div>

                    <div className="flex items-center gap-2 font-bold text-green-700">

                      <BookOpen size={18} />

                      {msg.blog.title}

                    </div>

                    <p className="text-sm mt-2">
                      {msg.blog.summary}
                    </p>

                    <Link to={`/blog/${msg.blog.id}`}>
                      <Button
                        className="mt-3 w-full"
                        size="sm"
                      >
                        Read Blog
                      </Button>
                    </Link>

                  </div>
                )}

                {msg.type === "recipe" && (
                  <div>

                    <div className="flex items-center gap-2 font-bold text-green-700">

                      <ChefHat size={18} />

                      {msg.recipe.title}

                    </div>

                    <p className="mt-2 text-sm">
                      <strong>Ingredients</strong>
                    </p>

                    <ul className="list-disc ml-5 text-sm">

                      {(msg.recipe.ingredients || []).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}

                    </ul>

                    <p className="mt-3 text-sm">
                      <strong>Instructions</strong>
                    </p>

                    <p className="text-sm whitespace-pre-wrap">
                      {msg.recipe.instructions}
                    </p>

                  </div>
                )}

              </div>

            ))}

            {loading && (
              <div className="flex gap-2 text-gray-500">

                <Loader2 className="animate-spin h-4 w-4" />

                Thinking...

              </div>
            )}

          </CardContent>

          <form
            onSubmit={sendMessage}
            className="border-t p-3 flex gap-2"
          >

            <Input
              placeholder="Ask anything..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
            />

            <Button
              disabled={loading}
              type="submit"
            >
              <Send size={18} />
            </Button>

          </form>

        </Card>
      )}
    </div>
  );
}