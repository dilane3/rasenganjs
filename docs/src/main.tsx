import '@rasenganjs/image/css';
import '@rasenganjs/mdx/css';
import '@/styles/index.css';
import { type AppProps } from 'rasengan';
import AppRouter from '@/app/app.router';
import ThemeProvider from '@rasenganjs/theme';

export default function App({ Component, children }: AppProps) {
  return (
    <ThemeProvider>
      <Component router={AppRouter}>{children}</Component>
    </ThemeProvider>
  );
}
