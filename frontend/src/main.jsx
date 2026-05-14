import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext' // Dodato

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Obavili smo App sa AuthProvider-om */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)