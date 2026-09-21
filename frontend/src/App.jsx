import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Breadcrumbs from './components/Breadcrumbs'
import DLServiceHome from './components/DLServiceHome'
import DLApplicationFlow from './components/DLApplicationFlow'
import DLTracker from './components/DLTracker'
import AccessibilityBar from './components/AccessibilityBar'
import CookieBanner from './components/CookieBanner'

/**
 * App Component — Prometheus Citizen Connect
 *
 * Routes:
 * /       → DL Service Home (5 action cards)
 * /apply  → DL Application Flow (consent → fetch → form → success)
 * /track  → DL Application Tracking (5-step timeline)
 */
export default function App() {
  return (
    <div className="min-h-screen bg-page-bg flex flex-col">
      {/* Top Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        <div className="content-container">
          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Page Routes */}
          <Routes>
            <Route path="/" element={<DLServiceHome />} />
            <Route path="/apply" element={<DLApplicationFlow />} />
            <Route path="/track" element={<DLTracker />} />
          </Routes>
        </div>
      </main>

      {/* Floating Accessibility Bar (right side) */}
      <AccessibilityBar />

      {/* Cookie Consent Banner (bottom) */}
      <CookieBanner />
    </div>
  )
}
