import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  profile,
  socialLinks,
  isValidUrl,
  isHexColor,
  getLinkById,
} from '../lib/social-links.mjs'

test('profile has the expected name and tagline', () => {
  assert.equal(profile.name, 'Your Name')
  assert.equal(profile.tagline, 'SAP Consultant | Community Member')
})

test('config contains exactly the three required links in order', () => {
  assert.deepEqual(
    socialLinks.map((l) => l.label),
    ['LinkedIn', 'Twitter', 'SAP Community'],
  )
})

test('each link points to the required URL', () => {
  assert.equal(getLinkById('linkedin')?.url, 'https://www.linkedin.com')
  assert.equal(getLinkById('twitter')?.url, 'https://www.twitter.com')
  assert.equal(getLinkById('sap-community')?.url, 'https://community.sap.com')
})

test('each link uses its brand color', () => {
  assert.equal(getLinkById('linkedin')?.color, '#0077B5')
  assert.equal(getLinkById('twitter')?.color, '#1DA1F2')
  assert.equal(getLinkById('sap-community')?.color, '#0070F2')
})

test('all configured URLs and colors are valid', () => {
  for (const link of socialLinks) {
    assert.ok(isValidUrl(link.url), `${link.id} url should be valid`)
    assert.ok(isHexColor(link.color), `${link.id} color should be hex`)
  }
})

test('link ids are unique', () => {
  const ids = socialLinks.map((l) => l.id)
  assert.equal(new Set(ids).size, ids.length)
})

test('isValidUrl accepts http(s) and rejects everything else', () => {
  assert.equal(isValidUrl('https://example.com'), true)
  assert.equal(isValidUrl('http://example.com/path?q=1'), true)
  assert.equal(isValidUrl('javascript:alert(1)'), false)
  assert.equal(isValidUrl('ftp://example.com'), false)
  assert.equal(isValidUrl('not a url'), false)
  assert.equal(isValidUrl(''), false)
})

test('isHexColor validates 6-digit hex values only', () => {
  assert.equal(isHexColor('#0077B5'), true)
  assert.equal(isHexColor('#abcdef'), true)
  assert.equal(isHexColor('#fff'), false)
  assert.equal(isHexColor('0077B5'), false)
  assert.equal(isHexColor('#GGGGGG'), false)
})

test('getLinkById returns undefined for unknown ids and supports custom lists', () => {
  assert.equal(getLinkById('missing'), undefined)
  const custom = [{ id: 'x', label: 'X', url: 'https://x.com', color: '#000000' }]
  assert.equal(getLinkById('x', custom)?.label, 'X')
  assert.equal(getLinkById('linkedin', custom), undefined)
})
