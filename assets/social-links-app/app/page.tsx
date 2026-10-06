import { ProfileHeader } from '@/components/profile-header'
import { SocialLinkButton } from '@/components/social-link-button'
import { profile, socialLinks } from '@/lib/social-links.mjs'

export default function Page() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-[480px]">
        <ProfileHeader name={profile.name} tagline={profile.tagline} />
        <nav aria-label="Social links" className="mt-10">
          <ul className="flex flex-col gap-3">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <SocialLinkButton
                  label={link.label}
                  url={link.url}
                  color={link.color}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  )
}
