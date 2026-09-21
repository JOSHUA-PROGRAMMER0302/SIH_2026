import React from 'react'

/**
 * DLApplicationForm Component
 * 7-field form for DL application with auto-fill support from Prometheus.
 * Fields: Full Name, DOB, Address, Mobile, Vehicle Class, State/RTO, Application Type.
 */

const VEHICLE_CLASSES = [
  { value: '', label: 'Select Vehicle Class' },
  { value: 'MC 50CC', label: 'MC 50CC — Motorcycle (up to 50cc)' },
  { value: 'MC EX50CC', label: 'MC EX50CC — Motorcycle (above 50cc)' },
  { value: 'LMV', label: 'LMV — Light Motor Vehicle (Car)' },
  { value: 'LMV-NT', label: 'LMV-NT — Light Motor Vehicle (Non-Transport)' },
  { value: 'TRANS', label: 'TRANS — Transport Vehicle' },
  { value: 'HMV', label: 'HMV — Heavy Motor Vehicle' },
  { value: 'HGMV', label: 'HGMV — Heavy Goods Motor Vehicle' },
  { value: 'HPMV', label: 'HPMV — Heavy Passenger Motor Vehicle' },
]

const STATE_RTOS = [
  { value: '', label: 'Select State / RTO' },
  { value: 'RJ-14 Jaipur', label: 'RJ-14 — Jaipur, Rajasthan' },
  { value: 'RJ-19 Jodhpur', label: 'RJ-19 — Jodhpur, Rajasthan' },
  { value: 'RJ-20 Kota', label: 'RJ-20 — Kota, Rajasthan' },
  { value: 'GJ-01 Ahmedabad', label: 'GJ-01 — Ahmedabad, Gujarat' },
  { value: 'GJ-06 Vadodara', label: 'GJ-06 — Vadodara, Gujarat' },
  { value: 'DL-01 Delhi', label: 'DL-01 — New Delhi' },
  { value: 'DL-02 Delhi', label: 'DL-02 — Delhi (South)' },
  { value: 'MH-01 Mumbai', label: 'MH-01 — Mumbai, Maharashtra' },
  { value: 'MH-12 Pune', label: 'MH-12 — Pune, Maharashtra' },
  { value: 'KA-01 Bangalore', label: 'KA-01 — Bangalore, Karnataka' },
  { value: 'TN-01 Chennai', label: 'TN-01 — Chennai, Tamil Nadu' },
  { value: 'UP-80 Agra', label: 'UP-80 — Agra, Uttar Pradesh' },
  { value: 'KL-01 Trivandrum', label: 'KL-01 — Trivandrum, Kerala' },
]

export default function DLApplicationForm({
  formData,
  setFormData,
  verifiedFields,
  onSubmit,
  isSubmitting,
  errors,
}) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isVerified = (field) => verifiedFields?.includes(field)

  return (
    <form className="dl-form" onSubmit={onSubmit}>
      <div className="dl-form-header">
        <h2 className="dl-form-title">Driving Licence Application</h2>
        <p className="dl-form-subtitle">
          Fields marked with <span className="dl-verified-badge-inline">Verified</span> have been
          auto-filled from your Prometheus profile.
        </p>
      </div>

      <div className="dl-form-grid">
        {/* Full Name */}
        <div className="dl-form-group dl-form-full">
          <label className="dl-form-label">
            Full Name <span className="required-star">*</span>
            {isVerified('full_name') && <span className="dl-verified-badge">✓ Verified</span>}
          </label>
          <input
            type="text"
            className={`dl-form-input ${isVerified('full_name') ? 'dl-input-verified' : ''} ${errors?.full_name ? 'dl-input-error' : ''}`}
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            placeholder="Enter full name as per records"
            required
          />
          {errors?.full_name && <span className="dl-form-error">{errors.full_name}</span>}
        </div>

        {/* Date of Birth */}
        <div className="dl-form-group">
          <label className="dl-form-label">
            Date of Birth <span className="required-star">*</span>
            {isVerified('date_of_birth') && <span className="dl-verified-badge">✓ Verified</span>}
          </label>
          <input
            type="date"
            className={`dl-form-input ${isVerified('date_of_birth') ? 'dl-input-verified' : ''} ${errors?.date_of_birth ? 'dl-input-error' : ''}`}
            value={formData.date_of_birth}
            onChange={(e) => handleChange('date_of_birth', e.target.value)}
            required
          />
          {errors?.date_of_birth && <span className="dl-form-error">{errors.date_of_birth}</span>}
        </div>

        {/* Mobile Number */}
        <div className="dl-form-group">
          <label className="dl-form-label">
            Mobile Number <span className="required-star">*</span>
            {isVerified('mobile_number') && <span className="dl-verified-badge">✓ Verified</span>}
          </label>
          <input
            type="tel"
            className={`dl-form-input ${isVerified('mobile_number') ? 'dl-input-verified' : ''} ${errors?.mobile_number ? 'dl-input-error' : ''}`}
            value={formData.mobile_number}
            onChange={(e) => handleChange('mobile_number', e.target.value)}
            placeholder="+91XXXXXXXXXX"
            required
          />
          {errors?.mobile_number && <span className="dl-form-error">{errors.mobile_number}</span>}
        </div>

        {/* Address */}
        <div className="dl-form-group dl-form-full">
          <label className="dl-form-label">
            Address <span className="required-star">*</span>
            {isVerified('address') && <span className="dl-verified-badge">✓ Verified</span>}
          </label>
          <textarea
            className={`dl-form-textarea ${isVerified('address') ? 'dl-input-verified' : ''} ${errors?.address ? 'dl-input-error' : ''}`}
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Full residential address"
            rows={3}
            required
          />
          {errors?.address && <span className="dl-form-error">{errors.address}</span>}
        </div>

        {/* Vehicle Class */}
        <div className="dl-form-group">
          <label className="dl-form-label">
            Vehicle Class <span className="required-star">*</span>
          </label>
          <select
            className={`dl-form-select ${errors?.vehicle_class ? 'dl-input-error' : ''}`}
            value={formData.vehicle_class}
            onChange={(e) => handleChange('vehicle_class', e.target.value)}
            required
          >
            {VEHICLE_CLASSES.map((vc) => (
              <option key={vc.value} value={vc.value}>{vc.label}</option>
            ))}
          </select>
          {errors?.vehicle_class && <span className="dl-form-error">{errors.vehicle_class}</span>}
        </div>

        {/* State / RTO */}
        <div className="dl-form-group">
          <label className="dl-form-label">
            State / RTO <span className="required-star">*</span>
          </label>
          <select
            className={`dl-form-select ${errors?.state_rto ? 'dl-input-error' : ''}`}
            value={formData.state_rto}
            onChange={(e) => handleChange('state_rto', e.target.value)}
            required
          >
            {STATE_RTOS.map((rto) => (
              <option key={rto.value} value={rto.value}>{rto.label}</option>
            ))}
          </select>
          {errors?.state_rto && <span className="dl-form-error">{errors.state_rto}</span>}
        </div>

        {/* Application Type */}
        <div className="dl-form-group dl-form-full">
          <label className="dl-form-label">
            Application Type <span className="required-star">*</span>
          </label>
          <div className="dl-radio-group">
            <label className="dl-radio-option">
              <input
                type="radio"
                name="application_type"
                value="learners"
                checked={formData.application_type === 'learners'}
                onChange={(e) => handleChange('application_type', e.target.value)}
              />
              <div className="dl-radio-card">
                <span className="dl-radio-title">Learner's Licence</span>
                <span className="dl-radio-desc">First-time applicant — permits learning to drive</span>
              </div>
            </label>
            <label className="dl-radio-option">
              <input
                type="radio"
                name="application_type"
                value="permanent"
                checked={formData.application_type === 'permanent'}
                onChange={(e) => handleChange('application_type', e.target.value)}
              />
              <div className="dl-radio-card">
                <span className="dl-radio-title">Permanent Driving Licence</span>
                <span className="dl-radio-desc">After completing Learner's Licence validity period</span>
              </div>
            </label>
          </div>
          {errors?.application_type && <span className="dl-form-error">{errors.application_type}</span>}
        </div>
      </div>

      {/* Submit */}
      <div className="dl-form-actions">
        <button type="submit" className="dl-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="dl-spinner"></span>
              Submitting to RTO...
            </>
          ) : (
            <>
              Submit Application
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
