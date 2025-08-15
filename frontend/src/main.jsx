
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes } from "react-router"
import App from './App.jsx'
import { AuthProvider } from '../context/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
  
)
