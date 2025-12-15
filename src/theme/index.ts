// Universal Brand Color Tokens
const themes = {
  light: {
    brand: {
      blue: "#0c6dff",
      light: "#f0f7ff",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
    },

    ui: {
      background: "#ffffff",
      foreground: "#0f172a",

      card: "#ffffff",
      cardForeground: "#0f172a",

      popover: "#ffffff",
      popoverForeground: "#0f172a",

      primary: "#0c6dff",
      primaryForeground: "#ffffff",

      secondary: "#f1f5f9",
      secondaryForeground: "#0f172a",

      muted: "#f1f5f9",
      mutedForeground: "#64748b",

      accent: "#f1f5f9",
      accentForeground: "#0f172a",

      destructive: "#ef4444",
      destructiveForeground: "#ffffff",

      border: "#e2e8f0",
      input: "#e2e8f0",
      ring: "#0c6dff",

      radius: "8px",
    },

    app: {
      bodyBackground: "#f8fafc",
    }
  },
  dark: {
    brand: {
      blue: "#0c6dff",
      light: "#f0f7ff",
      success: "#10b981",
      warning: "#f59e0b",
      danger: "#ef4444",
    },

    ui: {
      background: "#0f172a",
      foreground: "#f8fafc",

      card: "#1e293b",
      cardForeground: "#f8fafc",

      popover: "#1e293b",
      popoverForeground: "#f8fafc",

      primary: "#0c6dff",
      primaryForeground: "#ffffff",

      secondary: "#334155",
      secondaryForeground: "#f8fafc",

      muted: "#334155",
      mutedForeground: "#94a3b8",

      accent: "#334155",
      accentForeground: "#f8fafc",

      destructive: "#ef4444",
      destructiveForeground: "#ffffff",

      border: "#334155",
      input: "#334155",
      ring: "#0c6dff",

      radius: "8px",
    },

    app: {
      bodyBackground: "#0f172a",
    }
  }
};

export type Theme = typeof themes.light;
export default themes;