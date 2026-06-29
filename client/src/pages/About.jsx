import { Link } from 'react-router-dom'
import { BookOpen, Bot, Heart, Sparkles, UtensilsCrossed } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function About() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About RecipeRec</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            An AI-powered recipe recommendation platform and food blog community for home cooks who love great food.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 space-y-10">
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            RecipeRec helps you discover dishes tailored to your taste, explore food stories from our community,
            and generate custom recipes with an AI chef assistant. Whether you are planning dinner or writing your
            next food blog, we bring inspiration and smart recommendations together in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
            <Sparkles className="h-8 w-8 mx-auto text-green-600 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Smart Recommendations</h3>
            <p className="text-sm text-gray-500">Personalized recipe picks based on your preferences and favorites.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
            <BookOpen className="h-8 w-8 mx-auto text-purple-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Food Blogs</h3>
            <p className="text-sm text-gray-500">Read and share stories, recipes, and culinary adventures.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center">
            <Bot className="h-8 w-8 mx-auto text-orange-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">AI Chef</h3>
            <p className="text-sm text-gray-500">Chat with our assistant to generate recipes and cooking guidance.</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link to="/auth/signup">
            <Button className="bg-green-600 hover:bg-green-700 rounded-2xl px-8 h-12">
              <Heart className="h-4 w-4 mr-2" />
              Join RecipeRec Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
