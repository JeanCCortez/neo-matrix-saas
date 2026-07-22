import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { I18nProvider } from './context/I18nContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BuyTokens from './pages/BuyTokens'
import Admin from './pages/Admin'

function PrivateRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/app" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
            </Route>
            <Route element={<Layout />}>
              <Route path="dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="buy-tokens" element={
                <PrivateRoute>
                  <BuyTokens />
                </PrivateRoute>
              } />
              <Route path="admin" element={
                <PrivateRoute adminOnly>
                  <Admin />
                </PrivateRoute>
              } />
            </Route>
          </Routes>
        </AuthProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}
