import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout'
import { WorkspaceProvider } from './context/WorkspaceContext'
import OverviewPage from './pages/overview/OverviewPage'
import RecordingPage from './pages/recording/RecordingPage'
import AssistantPage from './pages/assistant/AssistantPage'
import NotesPage from './pages/notes/NotesPage'
import BoardPage from './pages/board/BoardPage'
import DomainPage from './pages/DomainPage'
import KitPage from './pages/KitPage'
import PlaceholderPage from './pages/PlaceholderPage'
import ShellDemoPage from './pages/ShellDemoPage'
import TokensPage from './pages/TokensPage'
import { ThemeProvider } from './theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <BrowserRouter>
          <Routes>
            {/* dev pages, outside the shell */}
            <Route path="/_tokens" element={<TokensPage />} />
            <Route path="/_kit" element={<KitPage />} />
            <Route path="/_domain" element={<DomainPage />} />

            <Route element={<AppShell />}>
              <Route path="/_shell" element={<ShellDemoPage />} />
              <Route path="/tong-quan" element={<OverviewPage />} />
              <Route path="/ghi-chu" element={<NotesPage />} />
              <Route path="/ghi-am" element={<Navigate to="/ghi-am/demo" replace />} />
              <Route path="/ghi-am/:id" element={<RecordingPage />} />
              <Route path="/tai-lieu" element={<PlaceholderPage title="Tài liệu" icon="folder" />} />
              <Route path="/bang-cong-viec" element={<BoardPage />} />
              <Route path="/lich-nhac-nho" element={<PlaceholderPage title="Lịch & Nhắc nhở" icon="calendar_today" />} />
              <Route path="/tro-ly-ai" element={<AssistantPage />} />
              <Route path="/cong-viec-cua-toi" element={<PlaceholderPage title="Công việc của tôi" icon="check_circle" />} />
            </Route>

            <Route path="*" element={<Navigate to="/tong-quan" replace />} />
          </Routes>
        </BrowserRouter>
      </WorkspaceProvider>
    </ThemeProvider>
  )
}
