/**
 * Single source of truth for the landing page.
 * Edit the profile details and social URLs here.
 */

export const profile = {
  name: 'Your Name',
  tagline: 'SAP Consultant | Community Member',
}

/**
 * @typedef {Object} SocialLink
 * @property {'linkedin' | 'twitter' | 'sap-community'} id
 * @property {string} label
 * @property {string} url
 * @property {string} color Brand color as a hex string
 */

/** @type {SocialLink[]} */
export const socialLinks = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com',
    color: '#0077B5',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    url: 'https://www.twitter.com',
    color: '#1DA1F2',
  },
  {
    id: 'sap-community',
    label: 'SAP Community',
    url: 'https://community.sap.com',
    color: '#0070F2',
  },
]

/**
 * Returns true when the value is an absolute http(s) URL.
 * @param {string} value
 */
export function isValidUrl(value) {
  try {
    const { protocol } = new URL(value)
    return protocol === 'https:' || protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * Returns true when the value is a 6-digit hex color such as #0077B5.
 * @param {string} value
 */
export function isHexColor(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value)
}

/**
 * Looks up a link by id.
 * @param {string} id
 * @param {SocialLink[]} [links]
 */
export function getLinkById(id, links = socialLinks) {
  return links.find((link) => link.id === id)
}
