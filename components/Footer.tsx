import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 border-t border-gray-600/60">
      <div className="max-w-6xl mx-auto py-16 px-6">
        <div className="flex flex-col items-center space-y-12 text-center">
          {/* Logo Section */}
          <Link href="/" className="group flex flex-col items-center space-y-4 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <div className="relative w-36 h-18 md:w-44 md:h-22">
              <Image
                src="/hoppy hour wide header v2.png"
                alt="Hoppy Hour"
                fill
                className="object-contain drop-shadow-md filter group-hover:brightness-110 transition-all duration-300"
                sizes="(max-width: 768px) 144px, 176px"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-8 sm:gap-12">
            <Link
              href="/"
              className="text-gray-200 hover:text-emerald-400 transition-all duration-300 font-semibold text-lg hover:scale-110 hover:-translate-y-0.5"
            >
              Find Deals
            </Link>
            <Link
              href="/signup"
              className="text-gray-200 hover:text-emerald-400 transition-all duration-300 font-semibold text-lg hover:scale-110 hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-gray-200 transition-all duration-300 font-medium hover:scale-105 hover:-translate-y-0.5"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-gray-200 transition-all duration-300 font-medium hover:scale-105 hover:-translate-y-0.5"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-gray-800 transition-all duration-300 font-medium hover:scale-105 hover:-translate-y-0.5 col-span-2 sm:col-span-1"
            >
              Contact Us
            </Link>
          </nav>

          {/* Divider */}
          <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          {/* Copyright */}
          <div className="flex flex-col items-center space-y-3">
            <p className="text-gray-700 font-medium">
              &copy; {new Date().getFullYear()} Hoppy Hour. All rights reserved.
            </p>
            <p className="text-emerald-600 text-sm font-semibold tracking-wide">
              Find the best happy hours in your area
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;