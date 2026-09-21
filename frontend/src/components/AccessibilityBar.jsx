import React from 'react'

/**
 * AccessibilityBar Component
 * Floating right-side vertical toolbar with colored accessibility tabs.
 * Matches the green/teal/orange/pink tabs visible on the right edge of the screenshot.
 */
export default function AccessibilityBar() {
  const tabs = [
    { color: 'bg-gov-teal', icon: '💬', label: 'Feedback', ariaLabel: 'Give feedback' },
    { color: 'bg-gov-green', icon: '♿', label: 'Accessibility', ariaLabel: 'Accessibility options' },
    { color: 'bg-gov-orange', icon: '📋', label: 'Sitemap', ariaLabel: 'View sitemap' },
    { color: 'bg-gov-pink', icon: '◄', label: 'Back', ariaLabel: 'Go back' },
  ]

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col shadow-lg">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`accessibility-tab ${tab.color}`}
          aria-label={tab.ariaLabel}
          title={tab.label}
        >
          <span className="text-xs">{tab.icon}</span>
        </button>
      ))}
    </div>
  )
}
