import React, { useState } from 'react'

/**
 * CookieBanner Component
 * Fixed bottom cookie consent bar matching the screenshot.
 * Dark background with policy text and three action buttons.
 */
export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-cookie-bg text-cookie-text z-50 shadow-2xl">
      <div className="content-container py-3 flex items-center justify-between gap-6">
        {/* Left: Cookie text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-tight">
            This website uses cookies to provide a better user experience.
          </p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            By clicking "Accept", you consent to the use of cookies as outlined in the{' '}
            <a href="#" className="text-text-link underline hover:text-blue-300">
              Cookie Settings
            </a>
            .
          </p>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="cookie-btn cookie-btn-outline"
            onClick={() => setIsVisible(false)}
          >
            CUSTOMIZE COOKIES
          </button>
          <button
            className="cookie-btn cookie-btn-secondary"
            onClick={() => setIsVisible(false)}
          >
            DECLINE OPTIONAL COOKIES
          </button>
          <button
            className="cookie-btn cookie-btn-primary"
            onClick={() => setIsVisible(false)}
          >
            ACCEPT ALL COOKIES
          </button>
        </div>
      </div>
    </div>
  )
}
