/**
 * Prometheus — Citizen Connect (SIH26129)
 * Integration Layer
 *
 * Central API routing module that all frontend components use to communicate
 * with the backend. This layer is the single point of contact for:
 *
 * 1. Routing requests to the correct backend endpoints
 * 2. Standardizing request/response formats
 * 3. Future: Plugging in the "Intelligent Data Translation Engine"
 *    that will format data for specific government departments (RTO, Parivahan, etc.)
 */

// ============================================================
// Configuration
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// ============================================================
// Helper: Standardized fetch wrapper
// ============================================================

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Future: Add auth token here
    // 'Authorization': `Bearer ${getAuthToken()}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.detail || `API Error: ${response.status} ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Is the backend running?')
    }
    throw error
  }
}

// ============================================================
// Feedback API
// ============================================================

/**
 * Submit user feedback from the "Did you find this information helpful?" form.
 *
 * @param {Object} data - Feedback form data
 * @param {string} data.service_slug - Service identifier (e.g., "driving-licence")
 * @param {string} data.helpfulness - Rating: "yes" | "moderately" | "no"
 * @param {string|null} data.assessment_text - Optional usability assessment text
 * @param {string} data.captcha_code - User-entered captcha code
 * @returns {Promise<Object>} - { success, message, feedback_id }
 */
export async function submitFeedback(data) {
  // ============================================================
  // INTEGRATION POINT: Intelligent Data Translation Engine
  // ============================================================
  // In the future, this is where the Translation Engine will:
  //
  // 1. Validate the data against the target department's schema
  //    (e.g., RTO expects specific field formats)
  //
  // 2. Transform field names to match the department's API
  //    Example: { helpfulness: "yes" } → { rating_code: "POSITIVE" }
  //
  // 3. Enrich the payload with citizen profile data from the
  //    "Fill Once" store if the user is authenticated
  //    Example: auto-attach unified_id, name, phone
  //
  // 4. Route to the correct department endpoint
  //    Example: driving-licence → Parivahan/Sarathi API
  //             passport → MEA Passport Seva API
  //
  // const translatedData = await DataTranslationEngine.translate({
  //   sourceFormat: 'prometheus_feedback_v1',
  //   targetFormat: 'rto_parivahan_feedback_v2',
  //   data: data,
  //   department: 'MINISTRY_OF_ROAD_TRANSPORT',
  // });
  // ============================================================

  return apiRequest('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================================
// Citizen Profile API (Fill Once, Use Everywhere)
// ============================================================

/**
 * Mock citizen data for offline demo.
 * Used when the backend is unreachable.
 */
const MOCK_CITIZEN_PROFILES = {
  'CIT-20260001': {
    unified_id: 'CIT-20260001',
    full_name: 'Rajesh Kumar Sharma',
    date_of_birth: '1990-05-15',
    gender: 'male',
    aadhaar_hash: 'a1b2c3d4e5f6...hashed',
    phone: '+919876543210',
    email: 'rajesh.sharma@email.com',
    address: {
      line1: '42, MG Road',
      line2: 'Near City Mall',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
    },
  },
}

/**
 * Fetch a citizen profile by unified ID.
 * Supports the "Fill Once" architecture — a single profile
 * used to pre-fill forms across all government services.
 *
 * Falls back to mock data when the backend is unreachable.
 *
 * @param {string} unifiedId - Citizen's unique ID (e.g., "CIT-20260001")
 * @returns {Promise<Object>} - { source, verified, profile }
 */
export async function getCitizenProfile(unifiedId) {
  try {
    return await apiRequest(`/api/citizen/${unifiedId}`)
  } catch (error) {
    // Fallback to mock data for offline demo
    console.warn('Backend unreachable, using mock citizen data:', error.message)
    const profile = MOCK_CITIZEN_PROFILES[unifiedId]
    if (profile) {
      return {
        source: 'prometheus_offline_mock',
        verified: true,
        profile,
      }
    }
    throw new Error(`Citizen profile not found for ID: ${unifiedId}`)
  }
}

// ============================================================
// Intelligent Data Translation Engine (Mock Implementation)
// ============================================================

/**
 * Simulates the Intelligent Data Translation Engine.
 * In production, this engine would:
 * 1. Map Prometheus fields → target department field names
 * 2. Transform data formats (dates, addresses, phone numbers)
 * 3. Validate against department-specific rules
 * 4. Route to the correct department API
 *
 * For demo, it performs basic format conversions.
 */
const DataTranslationEngine = {
  /**
   * Transform form data from Prometheus format to RTO/Parivahan format.
   */
  translateForRTO(formData) {
    return {
      applicant_name: formData.full_name,
      dob: formData.date_of_birth
        ? formData.date_of_birth.split('-').reverse().join('/')  // YYYY-MM-DD → DD/MM/YYYY
        : '',
      permanent_address: formData.address,
      mobile: formData.mobile_number?.replace('+91', ''),  // Strip country code
      veh_class: formData.vehicle_class,
      rto_code: formData.state_rto?.split(' ')[0] || '',  // 'RJ-14 Jaipur' → 'RJ-14'
      app_type: formData.application_type === 'learners' ? 'LL' : 'DL',
      source_system: 'PROMETHEUS_CITIZEN_CONNECT',
      translation_version: '1.0',
    }
  },
}

// ============================================================
// Driving Licence Application API
// ============================================================

/**
 * Mock DL submission for offline demo.
 */
let mockAppCounter = 10245

/**
 * Submit a DL application.
 * Runs data through the Translation Engine, then sends to the
 * simulated RTO API (backend).
 *
 * Falls back to offline mock when backend is unreachable.
 *
 * @param {Object} formData - DL application form data
 * @returns {Promise<Object>} - { success, message, application_id, estimated_processing_days }
 */
export async function submitDLApplication(formData) {
  // Run through the Data Translation Engine
  const translatedData = DataTranslationEngine.translateForRTO(formData)
  console.log('[Translation Engine] Prometheus → RTO format:', translatedData)

  try {
    return await apiRequest('/api/dl/apply', {
      method: 'POST',
      body: JSON.stringify(formData),
    })
  } catch (error) {
    // Offline fallback: generate a mock application ID
    console.warn('Backend unreachable, using mock DL submission:', error.message)
    mockAppCounter++
    return {
      success: true,
      message: 'Your Driving Licence application has been submitted successfully to the RTO. (Demo Mode — Offline)',
      application_id: `DL-DEMO-${mockAppCounter}`,
      estimated_processing_days: 15,
    }
  }
}

/**
 * Track a DL application by its application ID.
 *
 * Falls back to hardcoded demo data when backend is unreachable.
 *
 * @param {string} applicationId - e.g., "DL-DEMO-10245"
 * @returns {Promise<Object>} - Tracking data with timeline steps
 */
export async function trackDLApplication(applicationId) {
  try {
    return await apiRequest(`/api/dl/track/${applicationId}`)
  } catch (error) {
    // Offline fallback: return demo tracking data
    console.warn('Backend unreachable, using mock tracking data:', error.message)

    // Accept any DL-DEMO-* ID for demo
    if (applicationId.toUpperCase().startsWith('DL-DEMO')) {
      return {
        application_id: applicationId,
        applicant_name: 'Rajesh Kumar Sharma',
        application_type: 'permanent',
        submitted_at: new Date().toISOString(),
        current_status: 'RTO Verification',
        steps: [
          { step: 1, label: 'Application Submitted', status: 'completed', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
          { step: 2, label: 'Documents Verified', status: 'completed', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { step: 3, label: 'RTO Verification', status: 'in_progress', timestamp: null },
          { step: 4, label: 'Driving Test', status: 'pending', timestamp: null },
          { step: 5, label: 'Licence Issued', status: 'pending', timestamp: null },
        ],
      }
    }

    throw new Error(`Application not found: ${applicationId}`)
  }
}

// ============================================================
// Health Check
// ============================================================

/**
 * Check if the backend API is reachable and healthy.
 * @returns {Promise<Object>} - { status, database, message }
 */
export async function checkApiHealth() {
  return apiRequest('/api/health')
}

