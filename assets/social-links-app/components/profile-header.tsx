import { User } from 'lucide-react'

type ProfileHeaderProps = {
  name: string
  tagline: string
}

export function ProfileHeader({ name, tagline }: ProfileHeaderProps) {
  return (
    <header className="flex flex-col items-center text-center">
      <div
        role="img"
        aria-label={`${name} profile photo placeholder`}
        className="flex size-24 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground"
      >
        <User className="size-10" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-balance text-2xl font-semibold tracking-tight text-foreground">
        {name}
      </h1>
      <p className="mt-2 text-pretty text-base leading-relaxed text-muted-foreground">
        {tagline}
      </p>
    </header>
  )
}
