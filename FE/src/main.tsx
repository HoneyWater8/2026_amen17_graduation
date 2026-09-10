import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initAnalytics } from './utils/analytics'

initAnalytics()

createRoot(document.getElementById('root')!).render(<App />)
