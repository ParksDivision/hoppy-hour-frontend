import React from 'react';
import { cn } from "@/lib/utils"
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className={cn(
      "w-full bg-gradient-to-r from-[#E8F3E8] via-[#9DC7AC] to-[#527C6B]",
      "mt-auto" // Pushes footer to bottom if content is short
    )}>
      {/* Top border accent */}
      <div className="h-1 bg-gradient-to-r from-[#9DC7AC] via-[#527C6B] to-[#E8F3E8] opacity-50" />

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/logo.png"
                alt="Hoppy Hour"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 40px, 48px"
              />
            </div>
            <span className="text-[#1B365D] text-xl md:text-2xl font-bold">
              Hoppy Hour
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <Link
              href="/privacy"
              className="text-[#2A5A45] hover:text-[#1B365D] transition-colors text-sm md:text-base"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#2A5A45] hover:text-[#1B365D] transition-colors text-sm md:text-base"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-[#2A5A45] hover:text-[#1B365D] transition-colors text-sm md:text-base"
            >
              Contact Us
            </Link>
          </nav>

          {/* Social Links - if needed */}
          <div className="flex items-center space-x-6">
            {/* Add social icons here if needed */}
          </div>

          {/* Copyright */}
          <div className="flex flex-col items-center space-y-2">
            <p className="text-[#2A5A45] text-sm text-center">
              &copy; {new Date().getFullYear()} Hoppy Hour. All rights reserved.
            </p>
            <p className="text-[#527C6B] text-xs text-center">
              Find the best happy hours in your area
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;