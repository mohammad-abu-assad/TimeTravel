import type { ReactElement, ReactNode } from 'react'

/** Minimal aria props we may inject into a control */
export type ControlAriaProps = {
  id?: string
  className?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  required?: boolean
  'aria-required'?: boolean
}

/** Generic props for a field wrapper that decorates a single control */
export type FormFieldProps<P extends ControlAriaProps = ControlAriaProps> = {
  /** A stable id used for label -> input association */
  id: string
  /** Visible label text */
  label: string
  /** Hide the label visually but keep it for screen readers */
  labelHidden?: boolean
  /** Error message to display (sets aria-invalid) */
  error?: string
  /** Optional hint/help text below the control */
  hint?: string
  /** Marks the field as required (shows asterisk + sets required/aria-required) */
  required?: boolean
  /** Extra classes for the outer wrapper */
  className?: string
  /** Extra classes to merge into the child control’s className */
  controlClassName?: string
  /** Optional element aligned to the right of the label (e.g., link or badge) */
  labelAction?: ReactNode
  /** The single form control (input/select/textarea/custom) */
  children: ReactElement<P>
}
