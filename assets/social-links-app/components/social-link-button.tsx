import { ArrowUpRight } from 'lucide-react'

type SocialLinkButtonProps = {
  label: string
  url: string
  color: string
}

export function SocialLinkButton({ label, url, color }: SocialLinkButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ backgroundColor: color }}
      className="group flex h-14 w-full items-center justify-between rounded-xl px-5 text-base font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span>{label}</span>
      <ArrowUpRight
        className="size-5 opacity-80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
