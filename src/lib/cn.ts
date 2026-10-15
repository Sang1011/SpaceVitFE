import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Custom design-token names that tailwind-merge cannot infer on its own.
const fontSizes = [
  'display-title-mobile', 'display-title', 'label-mono', 'caption', 'body-editor',
  'body-medium', 'section-title', 'body-default', 'card-title',
]
const spacing = [
  'margin', 'space-lg', 'gutter', 'space-sm', 'space-xs', 'margin-mobile', 'space-xl',
  'space-md', 'gutter-dense',
]
const colors = [
  'background', 'surface', 'surface-bright', 'surface-variant', 'surface-container-low',
  'surface-container', 'surface-container-high', 'border', 'text-primary', 'text-secondary',
  'primary', 'primary-container', 'brand', 'on-primary', 'primary-fixed', 'secondary',
  'secondary-fixed', 'ai-accent', 'ai-container', 'tertiary', 'tertiary-container',
  'tertiary-fixed', 'error', 'error-container', 'status-success', 'status-warning',
  'status-error', 'recording-red', 'priority-urgent', 'priority-high', 'priority-medium',
  'priority-low',
]

const twMerge = extendTailwindMerge({
  extend: {
    theme: { spacing, color: colors },
    classGroups: {
      'font-size': [{ text: fontSizes }],
      'font-family': [{ font: fontSizes }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
