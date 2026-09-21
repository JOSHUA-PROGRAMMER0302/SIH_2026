import React from 'react'

/**
 * ConsentModal Component
 * Shows what data the DL service is requesting from the citizen's
 * Prometheus profile, with Allow/Deny buttons.
 */

const REQUESTED_FIELDS = [
  { field: 'Full Name', icon: '👤', description: 'As registered in your Prometheus profile' },
  { field: 'Date of Birth', icon: '📅', description: 'Used for age verification (must be 18+)' },
  { field: 'Address', icon: '🏠', description: 'Permanent residential address for RTO jurisdiction' },
  { field: 'Mobile Number', icon: '📱', description: 'For OTP verification and status updates' },
]

export default function ConsentModal({ onAllow, onDeny }) {
  return (
    <div className="consent-overlay">
      <div className="consent-modal">
        {/* Header */}
        <div className="consent-header">
          <div className="consent-header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9,12 11,14 15,10" />
            </svg>
          </div>
          <h2 className="consent-title">Data Sharing Consent</h2>
          <p className="consent-subtitle">
            The <strong>Driving Licence Service (Sarathi Parivahan)</strong> is requesting
            access to the following information from your Prometheus profile.
          </p>
        </div>

        {/* Requested Fields */}
        <div className="consent-fields">
          <p className="consent-fields-label">Information requested:</p>
          {REQUESTED_FIELDS.map((item) => (
            <div key={item.field} className="consent-field-row">
              <span className="consent-field-check">✓</span>
              <div className="consent-field-info">
                <span className="consent-field-name">
                  <span className="consent-field-icon">{item.icon}</span>
                  {item.field}
                </span>
                <span className="consent-field-desc">{item.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Data Usage Notice */}
        <div className="consent-notice">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <p>
            Your data will be processed through the <em>Intelligent Data Translation Engine</em> and
            formatted to meet RTO requirements. No data is stored permanently by Prometheus beyond
            your profile.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="consent-actions">
          <button className="consent-btn-deny" onClick={onDeny}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Deny
          </button>
          <button className="consent-btn-allow" onClick={onAllow}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            Allow &amp; Continue
          </button>
        </div>
      </div>
    </div>
  )
}
