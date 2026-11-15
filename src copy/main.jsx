import { createRoot } from 'react-dom/client'
import '@fontsource-variable/plus-jakarta-sans'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import App from './App.jsx'
import BatasGalat from './components/BatasGalat.jsx'

createRoot(document.getElementById('root')).render(
  <BatasGalat penuh>
    <App />
  </BatasGalat>
)