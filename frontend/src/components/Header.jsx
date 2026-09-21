import React from 'react'
import indiaGovLogo from '../assets/india-gov-logo.jpg'

/**
 * Header Component
 * Pixel-perfect clone of the india.gov.in top navigation bar.
 * Contains: Logo (left), Search bar (center), Accessibility icons (right)
 */
export default function Header() {
  return (
    <header className="bg-gov-navy w-full">
      <div className="content-container flex items-center justify-between py-2">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src={indiaGovLogo}
            alt="india.gov.in — National Portal of India"
            className="h-10 object-contain"
          />
        </div>

        {/* Center: Search Bar */}
        <div className="flex items-center ml-8">
          <div className="relative flex items-center">
            {/* Search icon */}
            <span className="absolute left-3 text-gray-400 text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search Here"
              className="search-input pl-9"
              aria-label="Search the portal"
            />
          </div>
          <select className="category-select" aria-label="Search category">
            <option>All Categories</option>
            <option>Services</option>
            <option>Documents</option>
            <option>Schemes</option>
          </select>
          <button className="search-button" type="button">
            Search
          </button>
        </div>

        {/* Right: Accessibility & Navigation Icons */}
        <div className="flex items-center gap-3 ml-6 shrink-0">
          <a
            href="#main-content"
            className="text-white text-xs underline hover:text-gray-300 transition-colors whitespace-nowrap"
          >
            Skip to main content
          </a>

          {/* Separator */}
          <span className="text-gray-500">|</span>

          {/* Calendar icon */}
          <button className="text-white hover:text-gray-300 transition-colors" aria-label="Calendar" title="Calendar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <rect x="7" y="13" width="3" height="3" fill="currentColor" />
            </svg>
          </button>

          {/* Contrast/Accessibility icon */}
          <button className="text-white hover:text-gray-300 transition-colors" aria-label="High contrast" title="High contrast mode">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
            </svg>
          </button>

          {/* Text size icon */}
          <button className="text-white hover:text-gray-300 transition-colors" aria-label="Text size" title="Change text size">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7V4h16v3" />
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="9" y1="20" x2="15" y2="20" />
            </svg>
          </button>

          {/* Separator */}
          <span className="text-gray-500">|</span>

          {/* Hamburger menu */}
          <button className="text-white hover:text-gray-300 transition-colors" aria-label="Menu" title="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
