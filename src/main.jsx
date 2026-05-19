import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import './index.css'

// on rend l'appli dans la div root du index.html
// les providers c'est pour que les composants enfants puissent acceder aux donnees
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  // </StrictMode>,
)

// note: l'ordre des providers est important
// BrowserRouter > ThemeProvider > AuthProvider > App
