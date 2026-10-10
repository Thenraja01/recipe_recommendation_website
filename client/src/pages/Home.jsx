import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '@/context/AuthContext'
import { getBlogUrl } from '@/lib/slug'
import {
  Search,
  Sparkles,
  BookOpen,
  Loader2,
  ArrowRight,
  Heart,
  ChefHat,
  Flame,
  UserPlus,
  MessageSquare,
  CheckCircle2,
  PenTool,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

const guideSteps = [
  {
    icon: UserPlus,
    badge: 'Step 1',
    title: 'Getting Started',
    color: 'bg-orange-100 text-[#ff751f]',
    description:
      'Browse public food blogs and stories freely. Sign up or log in to bookmark stories and write your own blogs.',
  },
  {
    icon: BookOpen,
    badge: 'Step 2',
    title: 'Discover Stories',
    color: 'bg-blue-100 text-[#1800ad]',
    description:
      'Explore community culinary stories, authentic dish origins, secret tips, and step-by-step masterclasses.',
  },
  {
    icon: MessageSquare,
    badge: 'Step 3',
    title: 'AI Chef Assistant',
    color: 'bg-teal-100 text-[#15789a]',
    description:
      'Click the floating AI assistant anytime for culinary inspiration, ingredient swaps, and cooking questions.',
  },
  {
    icon: PenTool,
    badge: 'Step 4',
    title: 'Publish & Favorite',
    color: 'bg-rose-100 text-rose-600',
    description:
      'Write and publish your own culinary blogs. Save your favorite stories with a single click to your Favorites collection.',
  },
]

function GuestHome({ blogs, loadingBlogs }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/blogs')
    }
  }

  return (
    <div className="relative min-h-screen bg-white pb-24 overflow-x-hidden">
      {/* 1. CANVA-INSPIRED HERO SECTION */}
      <section className="relative bg-[#ff751f] pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-12 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left Column: Title, Subtitle, Canva Pill Button, Search */}
            <div className="lg:col-span-7 z-20 text-left">
              <h1 className="font-anton text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-[0.85] tracking-normal text-black select-none drop-shadow-sm">
                Discover
              </h1>

              <div className="mt-4 sm:mt-6 max-w-xl">
                <p className="text-[#1800ad] font-bold text-lg sm:text-xl md:text-2xl leading-snug">
                  “dishes, read food stories, and let our AI chef help you cook”
                </p>
                <p className="text-[#1800ad] font-bold text-base sm:text-lg md:text-xl mt-1 opacity-95">
                  — sign up to save favorites and publish your stories.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white border-2 border-black text-black font-extrabold text-base hover:bg-black hover:text-white transition-all duration-200 shadow-[0_5px_0_0_#000000] active:translate-y-1 active:shadow-[0_1px_0_0_#000000]"
                >
                  Explore & Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <Link
                  to="/blogs"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#1800ad] text-white font-bold text-base hover:bg-[#120085] transition-all duration-200 shadow-[0_4px_0_0_#000000] active:translate-y-1 active:shadow-none"
                >
                  <BookOpen className="mr-2 h-4 w-4" /> Food Blogs
                </Link>
              </div>

              {/* Fast Quick Search Input */}
              <form onSubmit={handleSearchSubmit} className="mt-6 sm:mt-8 max-w-md">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gray-500 h-5 w-5 pointer-events-none" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search food blogs, recipes, ingredients..."
                    className="w-full h-12 pl-11 pr-24 rounded-full bg-white/95 border-2 border-black text-gray-900 placeholder:text-gray-500 shadow-[0_3px_0_0_#000000] focus-visible:ring-2 focus-visible:ring-black text-sm sm:text-base font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 py-2 rounded-full bg-[#ff751f] text-black font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Dish Plate */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative z-30 -mb-16 sm:-mb-24 lg:-mb-36">
              <div className="relative group">
                <img
                  src="/canva-dish.png"
                  alt="Delicious food bowl illustration"
                  className="w-[280px] sm:w-[380px] md:w-[440px] lg:w-[500px] xl:w-[540px] max-w-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] rotate-[8deg] group-hover:rotate-[5deg] group-hover:scale-105 transition-all duration-500 select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAVE SEPARATOR */}
      <div className="relative w-full overflow-hidden leading-none z-10 -mt-1 bg-white">
        <svg
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 md:h-36 lg:h-44 text-[#ff751f] fill-current block"
        >
          <path d="M0,0 L1440,0 L1440,85 C1280,150 1100,165 880,120 C640,70 360,130 0,80 Z" />
        </svg>
      </div>

      {/* 2. CALLIGRAPHY BANNER */}
      <section className="relative z-20 -mt-6 sm:-mt-10 md:-mt-14 mb-16 text-center px-4">
        <div className="inline-block relative">
          <p className="font-handelson text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-black select-none tracking-wide drop-shadow-sm rotate-[-2deg]">
            FEEL <span className="text-[#ff751f] italic underline decoration-wavy decoration-2 sm:decoration-4">taste</span>
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-400">
            <span>Authentic Stories</span>
            <span>•</span>
            <span>AI Kitchen</span>
            <span>•</span>
            <span>Home Cooking</span>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#ff751f] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Flame className="h-7 w-7" />
            </div>
            <h3 className="font-extrabold text-xl text-gray-900 mb-3">Authentic Flavors</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Explore step-by-step cooking techniques, ingredient guides, and traditional recipes shared by real cooks.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1800ad] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="h-7 w-7" />
            </div>
            <h3 className="font-extrabold text-xl text-gray-900 mb-3">AI Chef Assistant</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Need a cooking substitution or quick guidance? Chat with our 24/7 AI chef assistant on any page.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="font-extrabold text-xl text-gray-900 mb-3">Food Blog Community</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Read food stories, cultural cooking tales, and kitchen secrets written by home cooks and food bloggers.
            </p>
          </div>
        </div>
      </section>

      {/* 4. GUIDE & HOW IT WORKS */}
      <section id="guide" className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-y border-gray-200/60 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[#1800ad] font-black uppercase text-xs sm:text-sm tracking-widest">
              Quick Guide & Documentation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
              How Recipe<span className="text-[#ff751f]">Rec</span> Works
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-2">
              Everything you need to get the most out of your cooking experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guideSteps.map((step) => (
              <div
                key={step.title}
                className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${step.color}`}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-50 flex items-center text-xs font-bold text-gray-500">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-1.5" />
                  Ready to use
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED FOOD BLOGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#15789a] font-black uppercase text-xs sm:text-sm tracking-widest">
              Culinary Reads
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-2 mt-1">
              <BookOpen className="h-7 w-7 text-[#15789a]" />
              Featured Food Blogs
            </h2>
          </div>
          <Link
            to="/blogs"
            className="text-[#15789a] hover:text-[#0f5c76] font-bold text-sm sm:text-base flex items-center gap-1 transition-colors"
          >
            Read all stories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingBlogs ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#15789a]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.id} to={getBlogUrl(blog)} className="group">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 flex flex-col">
                  {blog.image ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white">
                      <ChefHat className="h-10 w-10 opacity-75" />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-gray-900 line-clamp-2 mb-2 group-hover:text-[#ff751f] transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{blog.content}</p>
                    </div>
                    <span className="text-xs font-bold text-[#15789a] mt-4 inline-flex items-center gap-1">
                      Read article <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#ff751f] via-orange-500 to-[#f85001] rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight drop-shadow-sm">
              Ready to Cook & Share?
            </h3>
            <p className="text-base sm:text-lg opacity-95 mb-8 leading-relaxed">
              Join RecipeRec today to save favorite blogs, write your own stories, and cook with your personal AI assistant.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth/signup">
                <Button className="bg-white text-black hover:bg-black hover:text-white rounded-full h-13 px-9 font-extrabold text-base shadow-xl transition-all">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-black/30 backdrop-blur-md text-white hover:bg-black/50 border border-white/40 rounded-full h-13 px-8 font-bold text-base transition-all">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AuthenticatedHome({ user, blogs, loadingBlogs }) {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/blogs')
    }
  }

  return (
    <div className="relative min-h-screen bg-white pb-24 overflow-x-hidden">
      {/* AUTHENTICATED HERO */}
      <section className="relative bg-[#ff751f] pt-10 sm:pt-14 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-12 overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 z-20 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-black text-xs font-black uppercase tracking-wider mb-2">
                <Sparkles className="h-3 w-3" />
                <span>Welcome back, {user?.username || 'Chef'}!</span>
              </div>
              <h1 className="font-anton text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-black select-none leading-[0.9]">
                DISCOVER
              </h1>
              <p className="text-[#1800ad] font-bold text-lg sm:text-xl mt-3 max-w-xl">
                Ready to cook? Explore food blogs or write a new kitchen story today.
              </p>

              <form onSubmit={handleSearchSubmit} className="mt-6 max-w-md">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 text-gray-500 h-5 w-5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search food blogs, recipes, ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-13 pl-11 pr-28 rounded-full border-2 border-black bg-white text-gray-900 shadow-[0_4px_0_0_#000000] focus-visible:ring-2 focus-visible:ring-black text-base font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2.5 rounded-full bg-[#ff751f] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-3 mt-5">
                <Link to="/blogs">
                  <button className="px-5 py-2.5 rounded-full bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-800 transition-colors">
                    Food Blogs
                  </button>
                </Link>
                <Link to="/blogs/write">
                  <button className="px-5 py-2.5 rounded-full bg-white border border-black/30 text-black font-bold text-xs uppercase tracking-wider hover:bg-white/80 transition-colors">
                    + Write Story
                  </button>
                </Link>
                <Link to="/favorites">
                  <button className="px-5 py-2.5 rounded-full bg-[#1800ad] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#120085] transition-colors flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5 fill-white text-white" />
                    My Favorites
                  </button>
                </Link>
              </div>
            </div>

            {/* Dish Plate Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative z-30 -mb-12 sm:-mb-20 lg:-mb-28">
              <img
                src="/canva-dish.png"
                alt="Delicious bowl"
                className="w-[260px] sm:w-[340px] md:w-[420px] lg:w-[480px] drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] rotate-[8deg] hover:rotate-[5deg] transition-transform duration-500 select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ORGANIC WAVE */}
      <div className="relative w-full overflow-hidden leading-none z-10 -mt-1 bg-white">
        <svg
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
          className="w-full h-14 sm:h-20 md:h-28 text-[#ff751f] fill-current block"
        >
          <path d="M0,0 L1440,0 L1440,75 C1250,135 1050,150 820,105 C600,60 320,110 0,70 Z" />
        </svg>
      </div>

      {/* LATEST FOOD BLOGS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#15789a] font-black uppercase text-xs tracking-widest">
              Community Stories
            </span>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-2 mt-1">
              <BookOpen className="h-7 w-7 text-[#15789a]" />
              Latest Food Blogs
            </h2>
          </div>
          <Link to="/blogs" className="text-[#15789a] font-bold text-sm hover:underline">
            See all stories →
          </Link>
        </div>

        {loadingBlogs ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#15789a]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.id} to={getBlogUrl(blog)} className="group">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all h-full border border-gray-100 flex flex-col">
                  {blog.image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#ff751f] transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{blog.content}</p>
                    </div>
                    <span className="text-xs font-bold text-[#15789a] mt-4 inline-flex items-center gap-1">
                      Read story <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* AI CHEF CARD */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-r from-teal-700 to-[#15789a] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-teal-200 uppercase font-black text-xs tracking-wider">AI Kitchen Companion</span>
            <h3 className="text-2xl sm:text-3xl font-black mt-1 mb-2">Have a Cooking Question?</h3>
            <p className="text-teal-100 text-sm sm:text-base max-w-xl">
              Click the chat assistant button at the bottom right anytime to ask our AI chef for personalized cooking guidance, tips, or ingredient advice.
            </p>
          </div>
          <Link to="/blogs/write">
            <button className="px-7 py-3.5 rounded-full bg-white text-teal-900 font-extrabold text-sm whitespace-nowrap hover:bg-yellow-300 transition-colors shadow-lg">
              Write New Blog
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loadingBlogs, setLoadingBlogs] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true)
        const { data } = await api.get('/blogs')
        setBlogs((data.blogs || []).slice(0, 4))
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoadingBlogs(false)
      }
    }
    fetchBlogs()
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff751f]" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <GuestHome
        blogs={blogs}
        loadingBlogs={loadingBlogs}
      />
    )
  }

  return (
    <AuthenticatedHome
      user={user}
      blogs={blogs}
      loadingBlogs={loadingBlogs}
    />
  )
}
