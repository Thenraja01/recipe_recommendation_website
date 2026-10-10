import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Sparkles,
  Star,
  Clock,
  Flame,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export const dynamicFoodSlides = [
  {
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1200&q=80',
    title: 'Golden Saffron Herb Chicken Rice',
    category: "Chef's Special",
    prepTime: '25 mins',
    calories: '480 kcal',
    rating: '4.9',
    quote: '“Cooking is love made visible. Let our AI chef help you craft memorable meals.”',
    author: 'Chef Marco Rossi',
  },
  {
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&q=80',
    title: 'Pan-Seared Salmon & Crisp Asparagus',
    category: 'High Protein',
    prepTime: '20 mins',
    calories: '520 kcal',
    rating: '5.0',
    quote: '“Smart dietary recommendations tailored to your goals and fridge ingredients.”',
    author: 'Elena Vance, Nutritionist',
  },
  {
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80',
    title: 'Handmade Truffle Cream Tagliatelle',
    category: 'Artisan Pasta',
    prepTime: '30 mins',
    calories: '610 kcal',
    rating: '4.9',
    quote: '“Discover authentic culinary traditions and step-by-step cooking timers.”',
    author: 'Giulia Conti',
  },
  {
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80',
    title: 'Mediterranean Quinoa & Avocado Bowl',
    category: 'Fresh & Vegan',
    prepTime: '15 mins',
    calories: '390 kcal',
    rating: '4.8',
    quote: '“Healthy eating made effortless with instant recipe substitutes and guides.”',
    author: 'David Kim, Food Stylist',
  },
]

export default function AuthFoodShowcase({ badge = 'AI Kitchen' }) {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % dynamicFoodSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % dynamicFoodSlides.length)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + dynamicFoodSlides.length) % dynamicFoodSlides.length)
  }

  const currentSlide = dynamicFoodSlides[activeSlide]

  return (
    <div className="relative w-full lg:w-7/12 xl:w-7/12 min-h-[380px] lg:min-h-full overflow-hidden bg-slate-950 flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-white">
      {/* Background Images with smooth cross-fade */}
      {dynamicFoodSlides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } transform transition-transform duration-7000`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        </div>
      ))}

      {/* Top Header Controls Over Image */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-black/60 transition-all hover:-translate-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff751f]/90 text-black text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-lg">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{badge}</span>
        </div>
      </div>

      {/* Dynamic Floating Recipe Card Overlay */}
      <div className="relative z-10 my-auto py-8">
        <div className="max-w-md bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full bg-white/20 text-yellow-300 text-xs font-black uppercase tracking-widest backdrop-blur-sm">
              {currentSlide.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{currentSlide.rating}</span>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug drop-shadow-md">
            {currentSlide.title}
          </h2>

          <div className="flex items-center gap-4 mt-4 text-xs sm:text-sm text-gray-200 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#ff751f]" />
              <span>{currentSlide.prepTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-rose-400" />
              <span>{currentSlide.calories}</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-300 italic border-l-2 border-[#ff751f] pl-3 leading-relaxed">
            {currentSlide.quote}
          </p>
        </div>
      </div>

      {/* Bottom Slide Controls & Indicators */}
      <div className="relative z-10 flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          {dynamicFoodSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeSlide
                  ? 'w-8 bg-[#ff751f]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white backdrop-blur-sm transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white backdrop-blur-sm transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
