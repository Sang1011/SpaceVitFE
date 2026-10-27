/**
 * Breakpoint dùng chung. Giá trị phải khớp `theme.screens` trong tailwind.config.ts.
 * `dock` (1100px) là ngưỡng D4: từ đây panel chi tiết gắn cạnh nội dung, dưới đó thành popup.
 */
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, dock: 1100, xl: 1280 } as const

export const DOCK_QUERY = `(min-width: ${BREAKPOINTS.dock}px)`
