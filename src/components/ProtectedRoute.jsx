import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// composant pour proteger les routes (genre la creation de post)
function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth()

  // pas connecte -> on redirige vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // connecte mais pas admin alors qu'il faut l'etre
  if (requireAdmin && !isAdmin) {
    console.log("acces refuse: pas admin")
    return <Navigate to="/" replace />
  }

  // tout est bon on affiche la page
  return children
}

export default ProtectedRoute
