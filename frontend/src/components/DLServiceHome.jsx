import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * DLServiceHome Component
 * Landing page for the Driving Licence module with 5 service action cards.
 * Each card represents a DL-related service that citizens can access.
 */

const services = [
  {
    id: 'apply-ll',
    title: "Apply for Learner's Licence",
    description: 'Submit a new application for a Learner\'s Licence through the Sarathi portal.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    route: '/apply?type=learners',
    badge: 'Online',
  },
  {
    id: 'apply-dl',
    title: 'Apply for Driving Licence',
    description: 'Apply for a permanent Driving Licence after completing your Learner\'s period.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <circle cx="8" cy="15" r="2" />
        <line x1="14" y1="13" x2="20" y2="13" />
        <line x1="14" y1="16" x2="18" y2="16" />
      </svg>
    ),
    route: '/apply?type=permanent',
    badge: 'Online',
    highlighted: true,
  },
  {
    id: 'renew',
    title: 'Renew Licence',
    description: 'Renew your existing Driving Licence before or after the expiry date.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23,4 23,10 17,10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
    route: '#',
    badge: 'Coming Soon',
    disabled: true,
  },
  {
    id: 'update',
    title: 'Update Licence Details',
    description: 'Update your address, name, or other details on your existing licence.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    route: '#',
    badge: 'Coming Soon',
    disabled: true,
  },
  {
    id: 'track',
    title: 'Track Application',
    description: 'Check the real-time status of your DL application with your application ID.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    route: '/track',
    badge: 'Online',
  },
]

export default function DLServiceHome() {
  const navigate = useNavigate()

  return (
    <section className="dl-service-home">
      {/* Hero Section */}
      <div className="dl-hero">
        <div className="dl-hero-content">
          <div className="dl-hero-badge">
            <span className="dl-hero-badge-dot"></span>
            Prometheus — Citizen Connect
          </div>
          <h1 className="dl-hero-title">Driving Licence Services</h1>
          <p className="dl-hero-subtitle">
            Ministry of Road Transport and Highways — Sarathi Parivahan Portal
          </p>
          <p className="dl-hero-description">
            Apply, renew, or track your Driving Licence through a unified digital platform.
            Your data is fetched once from your Prometheus profile and shared securely.
          </p>
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="dl-cards-grid">
        {services.map((service) => (
          <button
            key={service.id}
            className={`dl-service-card ${service.highlighted ? 'dl-card-highlighted' : ''} ${service.disabled ? 'dl-card-disabled' : ''}`}
            onClick={() => !service.disabled && navigate(service.route)}
            disabled={service.disabled}
          >
            <div className="dl-card-icon-wrapper">
              {service.icon}
            </div>
            <div className="dl-card-content">
              <h3 className="dl-card-title">{service.title}</h3>
              <p className="dl-card-description">{service.description}</p>
            </div>
            <span className={`dl-card-badge ${service.disabled ? 'dl-badge-disabled' : 'dl-badge-online'}`}>
              {service.badge}
            </span>
            {!service.disabled && (
              <svg className="dl-card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="dl-info-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <p>
          <strong>How Prometheus works:</strong> Your verified profile data is securely shared with the RTO
          through the <em>Intelligent Data Translation Engine</em>. You fill your details once — they are
          reused across all government services.
        </p>
      </div>
    </section>
  )
}
