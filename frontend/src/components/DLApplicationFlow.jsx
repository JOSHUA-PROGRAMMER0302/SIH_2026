import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ConsentModal from './ConsentModal'
import DLApplicationForm from './DLApplicationForm'
import SubmissionSuccess from './SubmissionSuccess'
import { getCitizenProfile, submitDLApplication } from '../api/integrationLayer'

/**
 * DLApplicationFlow Component
 * Master component managing the 4-step DL application flow:
 *
 * Step 1: Consent — Show data request, Allow/Deny
 * Step 2: Fetch — Retrieve citizen data from Prometheus
 * Step 3: Form — Auto-filled DL application form
 * Step 4: Success — Submission confirmation
 *
 * This is the core Prometheus demo flow showing:
 * Profile → Consent → Fetch → Auto-fill → Translation Engine → RTO API → Status
 */

const INITIAL_FORM = {
  full_name: '',
  date_of_birth: '',
  address: '',
  mobile_number: '',
  vehicle_class: '',
  state_rto: '',
  application_type: 'permanent',
}

export default function DLApplicationFlow() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // Step management: 'consent' | 'fetching' | 'form' | 'success'
  const [step, setStep] = useState('consent')
  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    application_type: searchParams.get('type') || 'permanent',
  })
  const [verifiedFields, setVerifiedFields] = useState([])
  const [fetchStatus, setFetchStatus] = useState(null) // null | 'loading' | 'done' | 'error'
  const [fetchSource, setFetchSource] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [submissionResult, setSubmissionResult] = useState(null)

  // ============================================================
  // Step 1: Consent handlers
  // ============================================================
  const handleConsentAllow = () => {
    setStep('fetching')
    handleFetchCitizen()
  }

  const handleConsentDeny = () => {
    navigate('/')
  }

  // ============================================================
  // Step 2: Fetch citizen data from Prometheus
  // ============================================================
  const handleFetchCitizen = async () => {
    setFetchStatus('loading')

    try {
      const result = await getCitizenProfile('CIT-20260001')
      const profile = result.profile

      // Map profile data to form fields
      const verified = []
      const newFormData = { ...formData }

      if (profile.full_name) {
        newFormData.full_name = profile.full_name
        verified.push('full_name')
      }
      if (profile.date_of_birth) {
        newFormData.date_of_birth = profile.date_of_birth
        verified.push('date_of_birth')
      }
      if (profile.phone) {
        newFormData.mobile_number = profile.phone
        verified.push('mobile_number')
      }
      if (profile.address) {
        const addr = profile.address
        const addressStr = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode]
          .filter(Boolean)
          .join(', ')
        newFormData.address = addressStr
        verified.push('address')
      }

      // Auto-select RTO based on state
      if (profile.address?.state === 'Rajasthan') {
        newFormData.state_rto = 'RJ-14 Jaipur'
      } else if (profile.address?.state === 'Gujarat') {
        newFormData.state_rto = 'GJ-01 Ahmedabad'
      }

      setFormData(newFormData)
      setVerifiedFields(verified)
      setFetchSource(result.source)
      setFetchStatus('done')

      // Brief pause to show the fetch result, then go to form
      setTimeout(() => setStep('form'), 1500)
    } catch (error) {
      console.error('Failed to fetch citizen profile:', error)
      setFetchStatus('error')
      // Still allow manual entry
      setTimeout(() => setStep('form'), 2000)
    }
  }

  // ============================================================
  // Step 3: Form validation & submission
  // ============================================================
  const validateForm = () => {
    const newErrors = {}

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required'
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.mobile_number.trim()) newErrors.mobile_number = 'Mobile number is required'
    if (!formData.vehicle_class) newErrors.vehicle_class = 'Please select a vehicle class'
    if (!formData.state_rto) newErrors.state_rto = 'Please select your State / RTO'
    if (!formData.application_type) newErrors.application_type = 'Please select application type'

    // Age validation
    if (formData.date_of_birth) {
      const dob = new Date(formData.date_of_birth)
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      if (age < 18) newErrors.date_of_birth = 'Applicant must be 18 years or older'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const result = await submitDLApplication({
        ...formData,
        citizen_id: 'CIT-20260001',
      })

      setSubmissionResult(result)
      setStep('success')
    } catch (error) {
      setErrors({ _form: error.message || 'Submission failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // ============================================================
  // Render based on current step
  // ============================================================
  return (
    <div className="dl-flow-container">
      {/* Step Progress Bar */}
      <div className="dl-step-progress">
        {['Consent', 'Fetch Data', 'Application Form', 'Submitted'].map((label, i) => {
          const stepIndex = ['consent', 'fetching', 'form', 'success'].indexOf(step)
          const isCompleted = i < stepIndex
          const isActive = i === stepIndex

          return (
            <div key={label} className={`dl-step-item ${isCompleted ? 'dl-step-completed' : ''} ${isActive ? 'dl-step-active' : ''}`}>
              <div className="dl-step-circle">
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className="dl-step-label">{label}</span>
            </div>
          )
        })}
      </div>

      {/* Step 1: Consent */}
      {step === 'consent' && (
        <ConsentModal onAllow={handleConsentAllow} onDeny={handleConsentDeny} />
      )}

      {/* Step 2: Fetching */}
      {step === 'fetching' && (
        <div className="dl-fetch-container">
          <div className="dl-fetch-card">
            {fetchStatus === 'loading' && (
              <>
                <div className="dl-fetch-spinner"></div>
                <h3 className="dl-fetch-title">Fetching Citizen Details...</h3>
                <p className="dl-fetch-subtitle">
                  Connecting to Prometheus profile database
                </p>
              </>
            )}
            {fetchStatus === 'done' && (
              <>
                <div className="dl-fetch-success-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="9,12 11,14 15,10" />
                  </svg>
                </div>
                <h3 className="dl-fetch-title">Citizen Details Fetched</h3>
                <p className="dl-fetch-subtitle">
                  {verifiedFields.length} fields verified from {fetchSource === 'prometheus_database' ? 'Supabase Database' : 'Prometheus Mock Store'}
                </p>
                <div className="dl-fetch-fields">
                  {['full_name', 'date_of_birth', 'address', 'mobile_number'].map((field) => (
                    <div key={field} className="dl-fetch-field-row">
                      {verifiedFields.includes(field) ? (
                        <span className="dl-fetch-verified">✓ Verified</span>
                      ) : (
                        <span className="dl-fetch-unavailable">— Not Available</span>
                      )}
                      <span className="dl-fetch-field-name">
                        {field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {fetchStatus === 'error' && (
              <>
                <div className="dl-fetch-error-icon">⚠️</div>
                <h3 className="dl-fetch-title">Could not fetch profile</h3>
                <p className="dl-fetch-subtitle">
                  Prometheus database unreachable. You can fill the form manually.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Application Form */}
      {step === 'form' && (
        <>
          {errors._form && (
            <div className="dl-form-global-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              {errors._form}
            </div>
          )}
          <DLApplicationForm
            formData={formData}
            setFormData={setFormData}
            verifiedFields={verifiedFields}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            errors={errors}
          />
        </>
      )}

      {/* Step 4: Success */}
      {step === 'success' && submissionResult && (
        <SubmissionSuccess
          applicationId={submissionResult.application_id}
          applicantName={formData.full_name}
          estimatedDays={submissionResult.estimated_processing_days}
        />
      )}
    </div>
  )
}
