import { Link } from 'react-router-dom'
import { BookOpen, ChefHat, MessageSquare, Search, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const sections = [
  {
    icon: UserPlus,
    title: 'Getting Started',
    steps: [
      'Create a free account from the Login page.',
      'Browse public food blogs without signing in.',
      'After login, access recipes, favorites, search, and your profile.',
    ],
  },
  {
    icon: ChefHat,
    title: 'Recipes & Favorites',
    steps: [
      'Open Recipe from the navbar to browse all dishes.',
      'View full instructions on any recipe detail page.',
      'Save recipes to Favorites for quick access later.',
    ],
  },
  {
    icon: MessageSquare,
    title: 'AI Chef Chat',
    steps: [
      'Click the green chat button on any page.',
      'Ask for a dish name or describe what you want to cook.',
      'The AI chef generates steps and suggestions in real time.',
    ],
  },
  {
    icon: BookOpen,
    title: 'Food Blogs',
    steps: [
      'Read community blogs from the Blogs link.',
      'Signed-in users can write and edit their own posts.',
      'Use AI assist while writing to expand your content.',
    ],
  },
  {
    icon: Search,
    title: 'Search',
    steps: [
      'Use the Search page (login required) to find recipes and blogs.',
      'Filter results by title and explore recommendations.',
    ],
  },
]

export default function Doc() {
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-3">Documentation</h1>
          <p className="text-lg opacity-80">
            A quick guide to using RecipeRec — AI recipe recommendations and food blogging.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {sections.map(({ icon: Icon, title, steps }) => (
          <div key={title} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-green-100 text-green-700">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        ))}

        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-center">
          <p className="text-gray-700 mb-4">Need an account to unlock all features?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/auth">
              <Button variant="outline" className="rounded-xl">Login</Button>
            </Link>
            <Link to="/auth/signup">
              <Button className="bg-green-600 hover:bg-green-700 rounded-xl">Sign Up</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
