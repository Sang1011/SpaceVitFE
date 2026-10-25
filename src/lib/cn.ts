import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import colorNames from '../theme/color-names.json'

// Custom design-token names that tailwind-merge cannot infer on its own.
const fontSizes = [
  'display-title-mobile', 'display-title', 'label-mono', 'caption', 'body-editor',
  'body-medium', 'section-title', 'body-default', 'card-title',
]
const spacing = [
  'margin', 'space-lg', 'gutter', 'space-sm', 'space-xs', 'margin-mobile', 'space-xl',
  'space-md', 'gutter-dense',
]
// Cùng một danh sách với tailwind.config.ts; không tự khai báo lại để tránh lệch nhau.
const colors = colorNames as string[]

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
