

import ThemeRegistry from '@/components/theme-registry/theme.registry';
import { ToastProvider } from '@/utils/toast';
import NextAuthWrapper from '@/lib/next.auth.wrapper';
import { TrackContextProvider } from '@/lib/track.wrapper';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <NextAuthWrapper>
            <ToastProvider>
              <TrackContextProvider>
                {/* children là các file layout bên trong cac foder */}
                {children}
              </TrackContextProvider>
            </ToastProvider>
          </NextAuthWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}



