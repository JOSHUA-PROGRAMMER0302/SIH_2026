import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * SubmissionSuccess Component
 * Displayed after a successful DL application submission.
 * Shows the generated application ID and next steps.
 */
export default function SubmissionSuccess({ applicationId, applicantName, estimatedDays }) {
  const navigate = useNavigate()

  return (
    <div className="dl-success-container">
      <div className="dl-success-card">
        {/* Success Icon */}
        <div className="dl-success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="9,12 11,14 15,10" />
          </svg>
        </div>

        <h2 className="dl-success-title">Application Submitted Successfully!</h2>
        <p className="dl-success-subtitle">
          Your Driving Licence application has been submitted to the Regional Transport Office.
        </p>

        {/* Application Details Card */}
        <div className="dl-success-details">
          <div className="dl-success-detail-row">
            <span className="dl-success-detail-label">Application ID</span>
            <span className="dl-success-detail-value dl-success-app-id">{applicationId}</span>
          </div>
          <div className="dl-success-detail-row">
            <span className="dl-success-detail-label">Applicant</span>
            <span className="dl-success-detail-value">{applicantName}</span>
          </div>
          <div className="dl-success-detail-row">
            <span className="dl-success-detail-label">Estimated Processing</span>
            <span className="dl-success-detail-value">{estimatedDays} working days</span>
          </div>
          <div className="dl-success-detail-row">
            <span className="dl-success-detail-label">Status</span>
            <span className="dl-success-status-badge">Under Processing</span>
          </div>
        </div>

        {/* Data Translation Engine Info */}
        <div className="dl-success-engine-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16,18 22,12 16,6" />
            <polyline points="8,6 2,12 8,18" />
          </svg>
          <p>
            Your data was processed through the <strong>Intelligent Data Translation Engine</strong> —
            field formats were automatically converted from Prometheus profile format to
            Sarathi/Parivahan RTO format.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="dl-success-actions">
          <button
            className="dl-success-track-btn"
            onClick={() => navigate(`/track?id=${applicationId}`)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            Track Application
          </button>
          <button
            className="dl-success-home-btn"
            onClick={() => navigate('/')}
          >
            Back to Services
          </button>
        </div>
      </div>
    </div>
  )
}
