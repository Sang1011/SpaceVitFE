import { useCallback, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import { DOCK_QUERY } from '../../lib/breakpoints'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { AssistantPanel } from './AssistantPanel'
import { pageLabelFor } from './nav'
import { useAssistantChat } from './useAssistantChat'
import { ShellContext, useDockCount, type ShellCtx } from './shell-context'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

/**
 * Khung trang chung: Sidebar cố định, thanh trên cố định, vùng nội dung cuộn và panel Trợ lý gắn bên phải.
 * Khi có panel gắn cạnh nội dung (Trợ lý hoặc panel chi tiết) và màn đủ rộng, Sidebar thu về dạng icon.
 */
export function AppShell() {
  const { space, aiStatus } = useWorkspace()
  const { pathname } = useLocation()
  const [assistantOpen, setAssistantOpen] = useState(false)
  const docks = useDockCount()
  const wide = useMediaQuery(DOCK_QUERY)
  const compact = wide && (assistantOpen || docks > 0)
  const chat = useAssistantChat(pageLabelFor(pathname), space.name, aiStatus === 'offline')
  const { send } = chat

  const openAssistant = useCallback(() => setAssistantOpen(true), [])
  const closeAssistant = useCallback(() => setAssistantOpen(false), [])
  const toggleAssistant = useCallback(() => setAssistantOpen((o) => !o), [])
  const askAssistant = useCallback(
    (q: string) => {
      setAssistantOpen(true)
      send(q)
    },
    [send],
  )
  const shell = useMemo<ShellCtx>(
    () => ({ assistantOpen, openAssistant, closeAssistant, toggleAssistant, askAssistant, compact }),
    [assistantOpen, openAssistant, closeAssistant, toggleAssistant, askAssistant, compact],
  )

  return (
    <ShellContext.Provider value={shell}>
      <Sidebar compact={compact} />
      <div className={`flex min-h-screen flex-col bg-background transition-[padding] duration-200 ${compact ? 'pl-[72px]' : 'pl-[264px]'}`}>
        <TopBar breadcrumb={[space.name, pageLabelFor(pathname)]} compact={compact} />
        <div className="flex flex-1 items-start pt-16">
          <main className="relative min-h-[calc(100vh-64px)] min-w-0 flex-1 bg-background p-8">
            <Outlet />
          </main>
          <AssistantPanel open={assistantOpen} onClose={closeAssistant} chat={chat} />
        </div>
      </div>
    </ShellContext.Provider>
  )
}
