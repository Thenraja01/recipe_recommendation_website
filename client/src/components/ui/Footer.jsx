import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            © {new Date().getFullYear()} RecipeRec. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </footer>
  )
}
