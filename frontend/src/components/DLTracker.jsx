import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { trackDLApplication } from '../api/integrationLayer'

/**
 * DLTracker Component
 * 5-step timeline tracking for DL applications.
 * Shows: Submitted → Docs Verified → RTO Verification → Driving Test → Licence Issued
 */

const STATUS_ICONS = {
  completed: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  in_progress: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  pending: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
}

export default function DLTracker() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [applicationId, setApplicationId] = useState(searchParams.get('id') || '')
  const [trackingData, setTrackingData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Auto-fetch if ID is in URL
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setApplicationId(id)
      fetchTracking(id)
    }
  }, [searchParams])

  const fetchTracking = async (id) => {
    if (!id.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await trackDLApplication(id.trim())
      setTrackingData(result)
    } catch (err) {
      setError(err.message || 'Application not found')
      setTrackingData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchTracking(applicationId)
  }

  return (
    <div className="dl-tracker-container">
      {/* Search Section */}
      <div className="dl-tracker-search-card">
        <h2 className="dl-tracker-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          Track Your Application
        </h2>
        <p className="dl-tracker-subtitle">
          Enter your application ID to check the current status of your Driving Licence application.
        </p>

        <form className="dl-tracker-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="dl-tracker-input"
            placeholder="Enter Application ID (e.g., DL-DEMO-10245)"
            value={applicationId}
            onChange={(e) => setApplicationId(e.target.value)}
          />
          <button type="submit" className="dl-tracker-search-btn" disabled={isLoading || !applicationId.trim()}>
            {isLoading ? (
              <span className="dl-spinner"></span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                Track
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="dl-tracker-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          {error}
        </div>
      )}

      {/* Tracking Result */}
      {trackingData && (
        <div className="dl-tracker-result-card">
          {/* Application Info Header */}
          <div className="dl-tracker-info-header">
            <div className="dl-tracker-info-row">
              <span className="dl-tracker-info-label">Application ID</span>
              <span className="dl-tracker-info-value dl-tracker-app-id">{trackingData.application_id}</span>
            </div>
            <div className="dl-tracker-info-row">
              <span className="dl-tracker-info-label">Applicant</span>
              <span className="dl-tracker-info-value">{trackingData.applicant_name}</span>
            </div>
            <div className="dl-tracker-info-row">
              <span className="dl-tracker-info-label">Type</span>
              <span className="dl-tracker-info-value" style={{textTransform: 'capitalize'}}>
                {trackingData.application_type === 'learners' ? "Learner's Licence" : 'Permanent DL'}
              </span>
            </div>
            <div className="dl-tracker-info-row">
              <span className="dl-tracker-info-label">Current Status</span>
              <span className="dl-tracker-status-badge">{trackingData.current_status}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="dl-tracker-timeline">
            <h3 className="dl-tracker-timeline-title">Application Progress</h3>
            {trackingData.steps.map((step, index) => (
              <div
                key={step.step}
                className={`dl-timeline-step dl-timeline-${step.status}`}
              >
                <div className="dl-timeline-connector">
                  <div className="dl-timeline-dot">
                    {STATUS_ICONS[step.status]}
                  </div>
                  {index < trackingData.steps.length - 1 && (
                    <div className={`dl-timeline-line dl-line-${step.status}`}></div>
                  )}
                </div>
                <div className="dl-timeline-content">
                  <span className="dl-timeline-label">{step.label}</span>
                  {step.timestamp && (
                    <span className="dl-timeline-date">
                      {new Date(step.timestamp).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                  {step.status === 'in_progress' && (
                    <span className="dl-timeline-in-progress-label">In Progress</span>
                  )}
                  {step.status === 'pending' && (
                    <span className="dl-timeline-pending-label">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="dl-tracker-back">
        <button className="dl-tracker-back-btn" onClick={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
          Back to Services
        </button>
      </div>
    </div>
  )
}
