import "./App.css";
import React, { useEffect } from "react";
import TestRoller from "./Components/Roller/TestRoller";
import {
  useTheme,
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
let storage = window.localStorage;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function App() {
  let theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
              <IconButton
                onClick={colorMode.toggleColorMode}
                color="inherit"
              >
                {theme.palette.mode === "dark" ? (
                  <Brightness7Icon />
                ) : (
                  <Brightness4Icon />
                )}
              </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

function getColorMode() {
  let colorMode = storage.getItem("colorMode");
  console.log(colorMode);
  if (!colorMode || colorMode === "light") {
    colorMode = "light";
  } else {
    colorMode = "dark";
  }

  return colorMode;
}

export default function ToggleColorMode() {
  let [mode, setMode] = React.useState(() => getColorMode());

  useEffect(() => {
    storage.setItem("colorMode", mode);
  });

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  let theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#558b2f",
          },
        },
        typography: {
          fontFamily: "Space Mono",
          h1: {
            fontFamily: "Space Grotesk",
            fontWeight: 900,
            textAlign: "center",
            marginTop: "0.5 rem",
          },
          h2: {
            fontFamily: "Space Grotesk",
            fontWeight: 700,
          },
          h3: {
            fontFamily: "Space Grotesk",
            fontWeight: 700,
          },
          h4: {
            fontFamily: "Space Grotesk",
            fontWeight: 700,
            display: "inline-block",
            marginBottom: "1rem",
          },
          h5: {
            fontFamily: "Space Grotesk",
            fontWeight: 700,
          },
          h6: {
            fontFamily: "Space Grotesk",
            fontWeight: 700,
          },
        },
      }),
    [mode]
  );

  theme = responsiveFontSizes(theme);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        <TestRoller />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
