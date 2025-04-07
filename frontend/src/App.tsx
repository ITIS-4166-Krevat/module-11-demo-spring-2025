import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  Link,
  ThemeProvider,
} from "@mui/material"
import { JSX, useState } from "react";
import Header from "./components/Header";
import NewTodo from "./components/NewTodo";
import TodoList from "./components/TodoList";
import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import LoginForm from "./components/LoginForm";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App(): JSX.Element {
  const [token, setToken] = useState<string | null>(null);
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container sx={{ mt: 2 }}>
          <Header isLoggedIn={!!token} onLogout={() => setToken(null)} />
          {!token ? (
            <LoginForm onLogin={token => setToken(token)} />
          ) : (
            <BrowserRouter>
              <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Link component={NavLink} to="/" underline='none'>Todos</Link>
                <Link component={NavLink} to="/todos/new" underline='none'>New Todo</Link>
              </Box>
              <Routes>
                <Route index element={<TodoList token={token} />} />
                <Route path="/todos/new" element={<NewTodo token={token} />} />
              </Routes>
            </BrowserRouter>
          )}
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
