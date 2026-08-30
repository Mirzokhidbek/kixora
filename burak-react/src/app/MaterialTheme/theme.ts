import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let customTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#090d16",
    },
    secondary: {
      main: "#0f172a",
      light: "#1e293b",
      dark: "#020617",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: ['"Plus Jakarta Sans"', '"Outfit"', "sans-serif"].join(","),
    h1: {
      fontFamily: ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"].join(","),
      fontWeight: 900,
      letterSpacing: "-0.03em",
      color: "#0f172a",
    },
    h2: {
      fontFamily: ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"].join(","),
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#0f172a",
    },
    h3: {
      fontFamily: ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"].join(","),
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontFamily: ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"].join(","),
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontFamily: ['"Plus Jakarta Sans"', "sans-serif"].join(","),
      fontWeight: 800,
      textTransform: "none",
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "10px 24px",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          fontWeight: 800,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          border: "1px solid #e2e8f0",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 700,
        },
      },
    },
  },
});

customTheme = responsiveFontSizes(customTheme);

export default customTheme;
