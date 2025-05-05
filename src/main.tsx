import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './global.css'
import App from './App.tsx'
import { CartProvider } from './components/CartContext.tsx'
import { FirebaseProvider } from './context/FirebaseContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
    <CartProvider>
      <App />
    </CartProvider>
    </FirebaseProvider>
  </StrictMode>,
)
