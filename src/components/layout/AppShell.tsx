import { Outlet } from 'react-router-dom'
import { useWorkspace } from '../../context/WorkspaceContext'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

/** Shared page frame: fixed sidebar + fixed top bar + scrolling main. Pages render through <Outlet/>. */
export function AppShell() {
  const { space } = useWorkspace()
  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen flex-col bg-background pl-[264px]">
        <TopBar breadcrumb={['Không gian', space.name]} />
        <main className="relative min-h-[calc(100vh-64px)] flex-1 bg-background p-8 pt-24">
          <Outlet />
        </main>
      </div>
    </>
  )
}
