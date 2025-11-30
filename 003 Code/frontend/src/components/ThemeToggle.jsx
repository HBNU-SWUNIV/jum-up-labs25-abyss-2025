import React from "react";
import { useTheme } from "hooks/useTheme";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "light" ? "다크 모드" : "라이트 모드"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "none",
        border: "1px solid var(--border)",
        cursor: "pointer",
        lineHeight: 0,
        marginLeft: 4
      }}
    >
      {theme === "light" ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
    </button>
  );
}
