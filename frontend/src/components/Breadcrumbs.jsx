import React from 'react'

/**
 * Breadcrumbs Component
 * Navigation breadcrumbs: Home > Services > Apply for Driving Licence
 */
export default function Breadcrumbs() {
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Apply for Driving Licence', href: null },
  ]

  return (
    <nav aria-label="Breadcrumb" className="py-3">
      <ol className="flex items-center gap-1 text-xs text-text-secondary">
        {crumbs.map((crumb, index) => (
          <li key={crumb.label} className="flex items-center gap-1">
            {index > 0 && (
              <span className="text-text-muted mx-1">&gt;</span>
            )}
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-text-secondary hover:text-gov-blue underline transition-colors"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="text-text-muted">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
