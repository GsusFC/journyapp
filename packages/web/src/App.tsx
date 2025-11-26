import { useAccount } from 'wagmi'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WritePage } from './pages/WritePage'
import { HistoryPage } from './pages/HistoryPage'
import { LandingPage } from './pages/LandingPage'
import { SystemPage } from './pages/SystemPage'
import { ThemeProvider } from 'next-themes'
import { ToastProvider } from './contexts/ToastContext'

function App() {
  const { isConnected } = useAccount()

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={isConnected ? <Navigate to="/write" /> : <LandingPage />}
            />
            <Route
              path="/write"
              element={isConnected ? <WritePage /> : <Navigate to="/" />}
            />
            <Route
              path="/history"
              element={isConnected ? <HistoryPage /> : <Navigate to="/" />}
            />
            <Route
              path="/system"
              element={isConnected ? <SystemPage /> : <Navigate to="/" />}
            />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
