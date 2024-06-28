import React, { useState } from "react";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { themeCreator } from "./base";

// export const ThemeContext = React.createContext(
//   (themeName: string): void => {}
// );

const ThemeProviderWrapper = (props: { children?: React.ReactNode }) => {
  // const curThemeName = localStorage.getItem("appTheme") || "PureLightTheme";
  // const [themeName, _setThemeName] = useState(curThemeName);
  // const theme = themeCreator(themeName);
  // const setThemeName = (themeName: string): void => {
  //   localStorage.setItem("appTheme", themeName);
  //   _setThemeName(themeName);
  // };
  const theme = themeCreator("PureLightTheme");

  return (
    <StyledEngineProvider injectFirst>
      {/* <ThemeContext.Provider value={setThemeName}> */}
      {/* <ThemeContext.Provider value={setThemeName}> */}
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      {/* </ThemeContext.Provider> */}
    </StyledEngineProvider>
  );
};

export default ThemeProviderWrapper;
