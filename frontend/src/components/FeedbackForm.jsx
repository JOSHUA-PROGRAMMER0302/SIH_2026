import React, { useState } from 'react'
import { submitFeedback } from '../api/integrationLayer'

/**
 * FeedbackForm Component
 * "Did you find this information helpful?" section with:
 * - Three radio buttons (Yes, Moderately, No)
 * - Link/Information Usability Assessment textarea
 * - Mock captcha display ("fod245")
 * - Captcha input field
 * - Submit button
 */
export default function FeedbackForm() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [helpfulness, setHelpfulness] = useState('')
  const [assessmentText, setAssessmentText] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)

  // Mock captcha value — in production, fetch from /api/captcha
  const captchaText = 'fod245'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!helpfulness) {
      alert('Please select a helpfulness rating.')
      return
    }

    if (!captchaCode) {
      alert('Please enter the captcha code.')
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const result = await submitFeedback({
        service_slug: 'driving-licence',
        helpfulness,
        assessment_text: assessmentText || null,
        captcha_code: captchaCode,
      })

      setSubmitResult({ success: true, message: result.message })
      // Reset form
      setHelpfulness('')
      setAssessmentText('')
      setCaptchaCode('')
    } catch (error) {
      setSubmitResult({
        success: false,
        message: error.message || 'Failed to submit feedback. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="bg-card-bg rounded-sm border border-border-light mb-6">
      {/* Collapsible Header */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="feedback-form-content"
      >
        <h2 className="text-sm font-bold text-text-primary">
          Did you find this information helpful?
        </h2>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-text-secondary transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>

      {/* Form Content */}
      {isExpanded && (
        <div id="feedback-form-content" className="px-6 pb-5 border-t border-border-light pt-4">
          <form onSubmit={handleSubmit}>
            {/* Radio Buttons */}
            <div className="radio-group space-y-1 mb-5">
              <label>
                <input
                  type="radio"
                  name="helpfulness"
                  value="yes"
                  checked={helpfulness === 'yes'}
                  onChange={(e) => setHelpfulness(e.target.value)}
                />
                <span>
                  Yes, <span className="underline">The Page</span>{' '}
                  <span className="underline">Information</span>{' '}
                  <span className="underline">Proves To Be</span>{' '}
                  <span className="underline">Beneficial</span>.
                </span>
              </label>

              <label>
                <input
                  type="radio"
                  name="helpfulness"
                  value="moderately"
                  checked={helpfulness === 'moderately'}
                  onChange={(e) => setHelpfulness(e.target.value)}
                />
                <span>
                  It's <span className="underline">Moderately</span>{' '}
                  <span className="underline">Helpful</span>.
                </span>
              </label>

              <label>
                <input
                  type="radio"
                  name="helpfulness"
                  value="no"
                  checked={helpfulness === 'no'}
                  onChange={(e) => setHelpfulness(e.target.value)}
                />
                <span>
                  No, <span className="underline">The Page</span>{' '}
                  <span className="underline">Information</span>{' '}
                  <span className="underline">Does Not</span>{' '}
                  <span className="underline">Provide Useful</span>{' '}
                  <span className="underline">Information</span>.
                </span>
              </label>
            </div>

            {/* Assessment Textarea */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-text-primary mb-2">
                <span className="underline">Link/Information Usability Assessment</span>{' '}
                <span className="required-star">*</span>
              </label>
              <textarea
                className="form-textarea"
                placeholder="maximum character 500"
                maxLength={500}
                value={assessmentText}
                onChange={(e) => setAssessmentText(e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Captcha Section */}
            <div className="mb-5">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm text-text-secondary">Captcha</span>
                <span className="captcha-display">{captchaText}</span>
                {/* Refresh captcha icon */}
                <button
                  type="button"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Refresh captcha"
                  title="Refresh captcha"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23,4 23,10 17,10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
                {/* Audio captcha icon */}
                <button
                  type="button"
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Listen to captcha"
                  title="Audio captcha"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </button>
              </div>

              {/* Captcha Input */}
              <label className="block text-sm font-bold text-text-primary mb-2">
                Captcha code <span className="required-star">*</span>
              </label>
              <input
                type="text"
                className="form-input max-w-md"
                placeholder="Captcha Code"
                value={captchaCode}
                onChange={(e) => setCaptchaCode(e.target.value)}
                aria-required="true"
              />
            </div>

            {/* Submit Result Message */}
            {submitResult && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  submitResult.success
                    ? 'bg-gov-green-light text-gov-green'
                    : 'bg-red-50 text-gov-red'
                }`}
              >
                {submitResult.message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
