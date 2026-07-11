interface Props {
  appName: string
}

/**
 * Inline visual treatment for the app name. The hidden text keeps the full
 * name available to assistive technology while the runner replaces its final
 * character visually.
 */
export function BrandName({ appName }: Props) {
  return (
    <span className="brand-lockup">
      <span className="sr-only">{appName}</span>
      <span className="brand-lockup-visual" aria-hidden="true">
        <span className="brand-lockup-name">{appName.slice(0, -1)}</span>
        <span className="brand-lockup-runner">
          <img src="/brand-runner-i-v2.png" alt="" />
        </span>
      </span>
    </span>
  )
}
