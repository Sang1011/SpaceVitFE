import { useCallback, useEffect, useRef, useState } from 'react'

export interface ChatMsg {
  id: number
  from: 'user' | 'ai'
  text: string
}

export interface AssistantChat {
  msgs: ChatMsg[]
  /** Gửi một câu hỏi; trả lời là mô phỏng cho đến khi có máy chủ. */
  send: (text: string) => void
}

/** Hội thoại của panel Trợ lý. Nằm ở AppShell để trang bất kỳ (ví dụ ô hỏi ở Tổng quan) cũng gửi được câu hỏi. */
export function useAssistantChat(context: string, spaceName: string, offline: boolean): AssistantChat {
  const [msgs, setMsgs] = useState<ChatMsg[]>([])
  const next = useRef(1)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const send = useCallback(
    (text: string) => {
      const t = text.trim()
      if (!t || offline) return
      setMsgs((m) => [...m, { id: next.current++, from: 'user', text: t }])
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setMsgs((m) => [
          ...m,
          { id: next.current++, from: 'ai', text: `(Mô phỏng) Mình sẽ trả lời dựa trên "${context}" của ${spaceName}. Khi nối máy chủ, câu trả lời kèm nguồn trích dẫn sẽ hiện ở đây.` },
        ])
      }, 600)
    },
    [context, spaceName, offline],
  )

  return { msgs, send }
}
