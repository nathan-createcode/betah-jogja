import { createRoot } from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans'
import './index.css'
import App from './App.jsx'
import BatasGalat from './components/BatasGalat.jsx'

createRoot(document.getElementById('root')).render(
  <BatasGalat penuh>
    <App />
  </BatasGalat>
)