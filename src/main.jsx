import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Modal from 'react-modal' 
import './Css/index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
