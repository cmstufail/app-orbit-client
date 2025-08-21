import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'

import AuthProvider from './contexts/AuthProvider.jsx'
import { router } from './routes/router.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx';

const queryClient = new QueryClient();

createRoot( document.getElementById( 'root' ) ).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={ queryClient }>
      <AuthProvider>
        <Toaster />
        <RouterProvider router={ router } />
      </AuthProvider>
    </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
