import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout'
import { AuthProvider } from './context/AuthProvider'
import { WorkspaceProvider } from './context/WorkspaceContext'
import OverviewPage from './pages/overview/OverviewPage'
import RecordingPage from './pages/recording/RecordingPage'
import RecordingsPage from './pages/recording/RecordingsPage'
import CalendarPage from './pages/calendar/CalendarPage'
import MyTasksPage from './pages/my-tasks/MyTasksPage'
import DocumentsPage from './pages/documents/DocumentsPage'
import DocumentDetailPage from './pages/documents/DocumentDetailPage'
import AssistantPage from './pages/assistant/AssistantPage'
import MembersPage from './pages/members/MembersPage'
import NotesPage from './pages/notes/NotesPage'
import BoardPage from './pages/board/BoardPage'
import InvitePage from './pages/auth/InvitePage'
import LoginPage from './pages/auth/LoginPage'
import NoAccessPage from './pages/auth/NoAccessPage'
import RegisterPage from './pages/auth/RegisterPage'
import RequireAuth from './pages/auth/RequireAuth'
import DomainPage from './pages/DomainPage'
import KitPage from './pages/KitPage'
import ShellDemoPage from './pages/ShellDemoPage'
import TokensPage from './pages/TokensPage'
import { ToastProvider } from './components/ui/ToastProvider'
import { ThemeProvider } from './theme/ThemeProvider'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <WorkspaceProvider>
        <ToastProvider>
          <BrowserRouter>
          <Routes>
            {/* dev pages, outside the shell */}
            <Route path="/_tokens" element={<TokensPage />} />
            <Route path="/_kit" element={<KitPage />} />
            <Route path="/_domain" element={<DomainPage />} />

            {/* chưa vào Space */}
            <Route path="/dang-nhap" element={<LoginPage />} />
            <Route path="/dang-ky" element={<RegisterPage />} />
            <Route path="/loi-moi/:token" element={<InvitePage />} />
            <Route path="/khong-co-quyen" element={<NoAccessPage />} />

            <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route path="/_shell" element={<ShellDemoPage />} />
              <Route path="/tong-quan" element={<OverviewPage />} />
              <Route path="/ghi-chu" element={<NotesPage />} />
              <Route path="/ghi-am" element={<RecordingsPage />} />
              <Route path="/ghi-am/:id" element={<RecordingPage />} />
              <Route path="/tai-lieu" element={<DocumentsPage />} />
              <Route path="/tai-lieu/:id" element={<DocumentDetailPage />} />
              <Route path="/bang-cong-viec" element={<BoardPage />} />
              <Route path="/lich-nhac-nho" element={<CalendarPage />} />
              <Route path="/tro-ly-ai" element={<AssistantPage />} />
              <Route path="/cong-viec-cua-toi" element={<MyTasksPage />} />
              <Route path="/khong-gian/thanh-vien" element={<MembersPage />} />
            </Route>
            </Route>

            <Route path="*" element={<Navigate to="/tong-quan" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
      </WorkspaceProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
