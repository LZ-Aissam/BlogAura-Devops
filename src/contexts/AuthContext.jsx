import { createContext, useContext, useState, useEffect } from 'react'
import { login } from '../api/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // au chargement on verifie si ya un user dans le localStorage
  useEffect(() => {
    const saved = localStorage.getItem('blogaura_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch (e) {
        // au cas ou le json est corrompu
        console.log("erreur parsing localStorage", e)
        localStorage.removeItem('blogaura_user')
      }
    }
  }, [])
  // fonction de login
  const Connect = async (mail, password) => {
    try {
    const data = await login(mail, password)
    setUser(data.user)
    localStorage.setItem('blogaura_user', JSON.stringify(data.user))
    console.log("connexion reussie:", data.user.pseudo)
    return { success: true }
    } catch (e) {
      console.log("echec connexion pour:", mail, e)
      return { success: false, error: 'Email ou mot de passe incorrect' }
    }
  }
  // deconnexion
  const logout = () => {
    setUser(null)
    localStorage.removeItem('blogaura_user')
    console.log("deconnexion")
  }

  // verif si admin
  const isAdmin = (String(user?.can_edit) === "1" || user?.can_edit === true)
  // verif si connecte
  const isAuthenticated = user !== null


  return (
    <AuthContext.Provider value={{ user, login: Connect, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

// hook custom pour utiliser l'auth plus facilement
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit etre utilise dans un AuthProvider')
  }
  return context
}
