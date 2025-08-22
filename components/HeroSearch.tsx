'use client'

import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Search, MapPin, Clock, Utensils, Coffee, Wine } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const HeroSearch: React.FC = () => {
  const [location, setLocation] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const quickFilters = [
    { id: 'happy-hour', label: 'Happy Hour', icon: Clock },
    { id: 'cocktails', label: 'Craft Cocktails', icon: Wine },
    { id: 'bbq', label: 'BBQ & Food', icon: Utensils },
    { id: 'brunch', label: 'Austin Brunch', icon: Coffee },
  ]

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching for:', { location, filter: activeFilter })
  }

  const handleNearMe = () => {
    // TODO: Implement geolocation
    setLocation('Finding your location...')
    console.log('Getting current location')
  }

  return (
    <section className="relative py-16 px-6 bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-900/30">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 rounded-3xl blur-3xl"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Main heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-100 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl" style={{textShadow: '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2)'}}>
              Austin's Best
            </span>
            <br />
            <span className="text-emerald-400 drop-shadow-2xl" style={{textShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)'}}>
              Happy Hour Deals
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-lg" style={{textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
            Discover the best happy hour deals, food specials, and drink discounts at Austin's top bars and restaurants. Keep Austin weird and your wallet happy! 🤠
          </p>
        </div>

        {/* Search container */}
        <div className="relative">
          {/* Form glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 rounded-3xl blur-lg"></div>
          <div className="relative bg-slate-700 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-emerald-500/40 ring-1 ring-emerald-400/30 backdrop-blur-sm">
          {/* Location search */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Enter Austin neighborhood (Downtown, South Austin, East 6th...)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-500 bg-slate-600 text-white placeholder-gray-300 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/30 focus:bg-slate-500 hover:border-emerald-500/50 transition-all duration-300 shadow-lg"
              />
            </div>
          </div>

          {/* Quick filters */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-300 mb-3">Popular Searches:</p>
            <div className="flex flex-wrap gap-3">
              {quickFilters.map((filter) => {
                const Icon = filter.icon
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 font-medium",
                      activeFilter === filter.id
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg scale-105"
                        : "bg-slate-600 text-gray-200 border-gray-500 hover:border-emerald-400 hover:bg-slate-500 hover:scale-105"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{filter.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-8 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Search Deals
            </Button>
            <Button
              onClick={handleNearMe}
              variant="outline"
              className="flex-1 sm:flex-none border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-4 px-8 rounded-2xl text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Find Near Me
            </Button>
          </div>
          </div>
        </div>

        {/* Stats/social proof */}
        <div className="mt-8 text-center">
          <p className="text-gray-300 font-medium">
            Join <span className="text-emerald-400 font-bold">5,000+</span> Austin locals • 
            <span className="text-emerald-400 font-bold"> 200+</span> venues • 
            From <span className="text-emerald-400 font-bold">Downtown to South Austin</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default HeroSearch