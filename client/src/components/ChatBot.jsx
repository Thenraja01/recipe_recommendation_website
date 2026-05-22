import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, X, Bot, Loader2, ChefHat, Clock, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card'
import api from '../lib/api'

function RecipeBubble({ recipe }) {
  return (
    <div className="space-y-2 text-gray-800">
      <div className="flex items-center gap-2 font-bold text-green-700">
        <ChefHat className="h-4 w-4" />
        {recipe.title}
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="h-3 w-3" /> {recipe.prepTime} min
        </span>
        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{recipe.difficulty}</span>
        <span className="bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Users className="h-3 w-3" /> {recipe.servings} servings
        </span>
        {recipe.cuisine && (
          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{recipe.cuisine}</span>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Ingredients</p>
        <ul className="text-xs list-disc pl-4 space-y-0.5">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Steps</p>
        <p className="text-xs whitespace-pre-line leading-relaxed">{recipe.instructions}</p>
      </div>
      {recipe.tips && (
        <p className="text-xs italic text-green-600 border-t pt-2">Tip: {recipe.tips}</p>
      )}
    </div>
  )
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! Enter a dish name (e.g. Butter Chicken) or describe what you want to cook. I'll generate a full recipe for you.",
      sender: 'bot'
    }
  ]);
  const [dishName, setDishName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    const name = dishName.trim();
    const extra = prompt.trim();
    if (!name && !extra) return;

    const userText = name
      ? extra ? `${name} — ${extra}` : name
      : extra;

    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setDishName('');
    setPrompt('');
    setIsTyping(true);

    try {
      const { data } = await api.post('/chat/generate-recipe', {
        dishName: name || undefined,
        prompt: extra || name
      });

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          recipe: data.recipe
        }
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not generate recipe. Check the server is running and GROQ_API_KEY is set in server/.env.';
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, text: msg, sender: 'bot', isError: true }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-green-600 hover:bg-green-700 shadow-xl active:scale-90 transition-all text-white flex items-center justify-center p-0"
        >
          <MessageSquare className="h-7 w-7" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-[min(100vw-2rem,22rem)] sm:w-96 max-h-[85vh] flex flex-col shadow-2xl border-none overflow-hidden animate-in slide-in-from-bottom-5 duration-300 rounded-2xl">
          <CardHeader className="bg-green-600 p-4 shrink-0 flex flex-row items-center justify-between">
            <div className="flex items-center text-white space-x-2">
              <div className="p-1 rounded-full bg-white/20">
                <Bot className="h-5 w-5" />
              </div>
              <CardTitle className="text-sm font-bold">AI Recipe Chef</CardTitle>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 rounded p-1">
              <X className="h-5 w-5" />
            </button>
          </CardHeader>

          <CardContent
            ref={scrollRef}
            className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50 flex flex-col min-h-0"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[95%] text-sm p-3 rounded-2xl ${
                  msg.sender === 'bot'
                    ? `bg-white self-start shadow-sm border ${msg.isError ? 'border-red-200 text-red-700' : 'border-gray-100 text-gray-800'}`
                    : 'bg-green-600 text-white self-end shadow-md'
                }`}
              >
                {msg.recipe ? <RecipeBubble recipe={msg.recipe} /> : msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="bg-white text-gray-500 self-start p-3 rounded-2xl shadow-sm flex items-center gap-2 text-xs">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating your recipe...
              </div>
            )}
          </CardContent>

          <CardFooter className="p-3 bg-white border-t flex flex-col gap-2 shrink-0">
            <form onSubmit={handleGenerate} className="flex flex-col gap-2 w-full">
              <Input
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                placeholder="Dish name (e.g. Pasta Carbonara)"
                className="h-10 border-gray-200 rounded-xl text-sm"
              />
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Or prompt: quick vegan dinner for 2..."
                className="h-10 border-gray-200 rounded-xl text-sm"
              />
              <Button
                type="submit"
                disabled={isTyping || (!dishName.trim() && !prompt.trim())}
                className="h-10 w-full bg-green-600 hover:bg-green-700 rounded-xl gap-2"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Generate Recipe
                  </>
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
