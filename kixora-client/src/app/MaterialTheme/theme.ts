import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let customTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
      light: "#1f2937",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff4655",
      light: "#ff6b77",
      dark: "#e02d3c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    divider: "#e5e7eb",
  },
  typography: {
    fontFamily: ['"Inter"', '"Plus Jakarta Sans"', '"Outfit"', "sans-serif"].join(","),
    h1: {
      fontFamily: ['"Outfit"', '"Inter"', "sans-serif"].join(","),
      fontWeight: 900,
      letterSpacing: "-0.03em",
      color: "#111827",
    },
    h2: {
      fontFamily: ['"Outfit"', '"Inter"', "sans-serif"].join(","),
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#111827",
    },
    h3: {
      fontFamily: ['"Outfit"', '"Inter"', "sans-serif"].join(","),
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#111827",
    },
    h4: {
      fontFamily: ['"Outfit"', '"Inter"', "sans-serif"].join(","),
      fontWeight: 700,
      color: "#111827",
    },
    h5: {
      fontWeight: 700,
      color: "#111827",
    },
    h6: {
      fontWeight: 700,
      color: "#111827",
    },
    button: {
      fontFamily: ['"Inter"', "sans-serif"].join(","),
      fontWeight: 700,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          padding: "10px 24px",
          transition: "all 0.2s ease-in-out",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
        contained: {
          fontWeight: 700,
          backgroundColor: "#000000",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#1f2937",
          },
        },
        outlined: {
          borderColor: "#e5e7eb",
          color: "#111827",
          "&:hover": {
            borderColor: "#111827",
            backgroundColor: "#f9fafb",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "none",
          border: "1px solid #e5e7eb",
          transition: "all 0.25s ease",
          "&:hover": {
            borderColor: "#d1d5db",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
  },
});

customTheme = responsiveFontSizes(customTheme);

export default customTheme;
