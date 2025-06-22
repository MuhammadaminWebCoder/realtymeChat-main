import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactQueryProvider from './query/ReactQueryProvider.tsx';
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "next-themes";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
          <ToastContainer />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <App />
          </ThemeProvider>
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>
)
