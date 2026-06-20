import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({ theme: "dark" });

export function ThemeProvider({ children }) {
  const [theme] = useState("dark");

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
