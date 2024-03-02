'use client'

import { SessionProvider } from "next-auth/react"


export default function NextAuthWrapper({ children }: { children: React.ReactNode }) {
  return (
   
        
          <SessionProvider>
          {/* children là file page bên tron forder app */}
            {children} 
          
            </SessionProvider>
    
  )
}



