import React from 'react'
import dlIllustration from '../assets/dl-illustration.jpg'

/**
 * ServiceDetail Component
 * Main content area showing:
 * - Title: "Apply For Driving Licence" (blue, bold)
 * - Subtitle: "Ministry of Road Transport and Highways"
 * - Green "Fully Online" status badge
 * - Left: DL illustration card with Sarathi Parivahan logo
 * - Right: Descriptive text about the DL service
 * - Print and share icons
 */
export default function ServiceDetail() {
  return (
    <section id="main-content" className="bg-card-bg rounded-sm border border-border-light mb-4">
      {/* Title Bar */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gov-blue-text leading-tight">
              Apply For Driving Licence
            </h1>
            <p className="text-sm text-text-primary mt-0.5">
              Ministry of Road Transport and Highways
            </p>
            <span className="status-badge mt-1 inline-flex">
              Fully Online
            </span>
          </div>

          {/* Print & Share icons */}
          <div className="flex items-center gap-3 mt-1">
            <button
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Print this page"
              title="Print"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="6,9 6,2 18,2 18,9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </button>
            <button
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Share this page"
              title="Share"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Content: Illustration + Description */}
      <div className="px-6 pb-6 flex gap-8">
        {/* Left: DL Illustration Card */}
        <div className="shrink-0 w-[340px]">
          <div className="rounded overflow-hidden shadow-sm">
            <img
              src={dlIllustration}
              alt="Driving Licence illustration with Sarathi Parivahan logo"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Right: Description Text */}
        <div className="flex-1 pt-1">
          <p className="text-sm text-text-primary leading-relaxed">
            This service facilitates the citizens to apply for Driving licence (DL). One can fill the online
            form, pay the requisite fee, upload the required documents and book the online slot for
            driving test to avail the service. System provides complete workflow for processing at RTOs,
            integration with driving tracks and final approval process including generation of smart cards.
          </p>
          <div className="mt-5">
            <p className="text-sm font-bold text-text-primary">
              For More Information Visit
            </p>
            <a
              href="https://sarathi.parivahan.gov.in/sarathiservice"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-text-link hover:underline mt-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gov-green">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15,3 21,3 21,9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              https://sarathi.parivahan.gov.in/sarathiservice
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
