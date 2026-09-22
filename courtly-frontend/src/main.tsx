import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "@/styles/global.css"
import App from './App';
import { ClerkProvider } from "@clerk/react";
import "@/styles/clerk.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider appearance={{ theme: "simple" }} taskUrls={{
      "choose-organization": "/choose-organization"
    }}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
)
