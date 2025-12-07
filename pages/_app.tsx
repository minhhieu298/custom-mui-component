import { createTheme, ThemeProvider } from "@mui/material";
import type { AppProps } from "next/app";
import "@/styles/globals.scss"

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme} defaultMode="light">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
