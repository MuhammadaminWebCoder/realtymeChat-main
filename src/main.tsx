import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactQueryProvider from './query/ReactQueryProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>
)
