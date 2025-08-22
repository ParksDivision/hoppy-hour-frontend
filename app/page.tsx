'use client'

import React from 'react'
import Header from '@/components/Header'
import Navbar from '@/components/Navbar'
import HeroSearch from '@/components/HeroSearch'
import DealCarousel from '@/components/DealCarousel'
import FeatureCard from '@/components/FeatureCard'
import Footer from '@/components/Footer'
import { MockData } from '@/lib/data'

export default function HomePage() {
  // Get sample data for different sections - using 10 items for proper pagination
  const featuredDeals = MockData.slice(0, 10)
  const specialDeals = [...MockData.slice(0, 5), ...MockData.slice(0, 5)] // Create 10 items
  
  // Get the highest rated business for main feature
  const topRatedBusiness = MockData.reduce((prev, current) => 
    (prev.ratingOverall || 0) > (current.ratingOverall || 0) ? prev : current
  )
  
  // Get businesses for side-by-side feature cards
  const sideBySideFeatures = MockData
    .filter(business => business.id !== topRatedBusiness.id)
    .sort((a, b) => (b.ratingOverall || 0) - (a.ratingOverall || 0))
    .slice(0, 2)

  return (
    <div className="min-h-screen flex flex-col bg-slate-800 relative">
      {/* Left Side Panel - Fixed Position Overlay */}
      <div className="hidden 2xl:block fixed left-0 top-0 bottom-0 w-32 bg-gradient-to-b from-emerald-600 to-slate-700 z-10"></div>
      
      {/* Right Side Panel - Fixed Position Overlay */}
      <div className="hidden 2xl:block fixed right-0 top-0 bottom-0 w-32 bg-gradient-to-b from-slate-700 to-emerald-600 z-10"></div>
      
      {/* Header with background image and centered logo */}
      <Header />
      
      {/* Navigation bar */}
      <Navbar />
      
      {/* Hero Search Section */}
      <HeroSearch />
      
      {/* Main Content */}
      <main className="flex-1">
        {/* First Carousel - Featured Deals */}
        <DealCarousel
          title="Today&apos;s Austin Favorites"
          businesses={featuredDeals}
          className="bg-slate-700 py-8"
        />
        
        {/* Main Feature Card - Highest Rated */}
        <section className="py-16 px-6 bg-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
                Austin's Top Pick
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 mx-auto rounded-full shadow-lg" />
              <p className="text-gray-300 mt-4 text-lg font-medium">Experience the highest rated venue selected by Austin locals</p>
            </div>
            <div className="flex justify-center">
              <FeatureCard 
                business={topRatedBusiness} 
                variant="large"
                className="w-full"
              />
            </div>
          </div>
        </section>
        
        {/* Second Carousel - Different Deal Types */}
        <DealCarousel
          title="Austin Weekend Vibes"
          businesses={specialDeals}
          className="bg-slate-700 py-8"
        />
        
        {/* Side by Side Feature Cards */}
        <section className="py-16 px-6 bg-slate-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
                Keep Austin Happy
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 mx-auto rounded-full shadow-lg" />
              <p className="text-gray-300 mt-4 text-lg font-medium">Limited time offers from Austin's premium venues</p>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10">
              {sideBySideFeatures.map((business) => (
                <div key={business.id} className="w-full max-w-md lg:flex-1">
                  <FeatureCard
                    business={business}
                    variant="medium"
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
