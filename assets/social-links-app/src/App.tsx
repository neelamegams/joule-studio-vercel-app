import React, { useState } from 'react'
import { PROFILE, SOCIAL_LINKS } from './config'
import './App.css'

interface SocialButtonProps {
  label: string
  url: string
  color: string
  hoverColor: string
  icon: React.ReactNode
}

function SocialButton({ label, url, color, hoverColor, icon }: SocialButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-button"
      style={{
        backgroundColor: hovered ? hoverColor : color,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Visit ${label} profile`}
    >
      <span className="social-button__icon">{icon}</span>
      <span className="social-button__label">{label}</span>
    </a>
  )
}

// Inline SVG icons — no external dependencies
const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const SAPCommunityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
  </svg>
)

const AvatarIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
)

export default function App() {
  return (
    <main className="page">
      <div className="card">
        {/* Profile photo placeholder */}
        <div className="avatar" aria-label="Profile photo placeholder">
          <AvatarIcon />
        </div>

        {/* Name and bio */}
        <h1 className="name">{PROFILE.name}</h1>
        <p className="bio">{PROFILE.bio}</p>

        {/* Social buttons */}
        <div className="buttons">
          <SocialButton
            label={SOCIAL_LINKS.linkedin.label}
            url={SOCIAL_LINKS.linkedin.url}
            color={SOCIAL_LINKS.linkedin.color}
            hoverColor={SOCIAL_LINKS.linkedin.hoverColor}
            icon={<LinkedInIcon />}
          />
          <SocialButton
            label={SOCIAL_LINKS.twitter.label}
            url={SOCIAL_LINKS.twitter.url}
            color={SOCIAL_LINKS.twitter.color}
            hoverColor={SOCIAL_LINKS.twitter.hoverColor}
            icon={<TwitterIcon />}
          />
          <SocialButton
            label={SOCIAL_LINKS.sapCommunity.label}
            url={SOCIAL_LINKS.sapCommunity.url}
            color={SOCIAL_LINKS.sapCommunity.color}
            hoverColor={SOCIAL_LINKS.sapCommunity.hoverColor}
            icon={<SAPCommunityIcon />}
          />
        </div>
      </div>
    </main>
  )
}
