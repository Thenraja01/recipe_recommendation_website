import React from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-1 rounded-full bg-white shadow-xl mb-4 border-4 border-white">
            <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-16 w-16 text-gray-300" />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-800">User Profile</h1>
          <p className="text-gray-500 font-medium mb-8">Passionate Home Cook</p>
          
          <div className="grid grid-cols-2 gap-4 w-full px-6 mb-10">
            <div className="bg-blue-50 p-6 rounded-2xl text-center shadow-xl border border-blue-100 flex flex-col items-center group hover:bg-white transition-all duration-300">
               <span className="text-3xl font-bold text-blue-600 mb-1 group-hover:scale-110 transition-transform">0</span>
               <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">My Recipes</span>
            </div>
            <div className="bg-red-50 p-6 rounded-2xl text-center shadow-xl border border-red-100 flex flex-col items-center group hover:bg-white transition-all duration-300">
               <span className="text-3xl font-bold text-red-500 mb-1 group-hover:scale-110 transition-transform">0</span>
               <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Favorites</span>
            </div>
          </div>
          
          <div className="w-full space-y-3">
             <Button variant="outline" className="w-full h-14 rounded-2xl border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-between px-6 transition-all group">
                <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-3 text-gray-400 group-hover:rotate-45 transition-transform" />
                    Account Settings
                </div>
                <span className="text-xl font-light text-gray-300">&rarr;</span>
             </Button>
             <Button className="w-full h-14 rounded-2xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 flex items-center justify-center transition-all active:scale-95">
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
             </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
