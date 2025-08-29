import type { InputHTMLAttributes } from 'react'

/** Props for the PasswordInput UI component */
export type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Mark invalid for styling + aria */
  invalid?: boolean
  /** Extra classes to merge into the input */
  controlClassName?: string
  /** Extra classes to merge into the toggle button */
  buttonClassName?: string
  /** Custom toggle labels (defaults to Show/Hide) */
  toggleLabels?: { show: string; hide: string }
  /** Notify when reveal state changes */
  onRevealChange?: (revealed: boolean) => void
}
