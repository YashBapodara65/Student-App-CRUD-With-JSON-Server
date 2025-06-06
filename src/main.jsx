import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
    <>
    <Toaster limit={1} position='top,center'/>
    <App />
    </>,
)
