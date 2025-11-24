import { useAccount } from 'wagmi'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WritePage } from './pages/WritePage'
import { HistoryPage } from './pages/HistoryPage'
import { LandingPage } from './pages/LandingPage'
import { SystemPage } from './pages/SystemPage'
function App() {
  const { isConnected } = useAccount()

  return (
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
  )
}

export default App
