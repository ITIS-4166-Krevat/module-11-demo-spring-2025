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
import { Todo } from "./types/Todo";
import NewTodo from "./components/NewTodo";
import TodoList from "./components/TodoList";
import { BrowserRouter, NavLink, Route, Routes } from "react-router";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App(): JSX.Element {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Container sx={{ mt: 2 }}>
          <Header />
          <BrowserRouter>
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
              <Link component={NavLink} to="/" underline='none'>Todos</Link>
              <Link component={NavLink} to="/todos/new" underline='none'>New Todo</Link>
            </Box>
            <Routes>
              <Route index element={<TodoList />} />
              <Route path="/todos/new" element={<NewTodo />} />
            </Routes>
          </BrowserRouter>
        </Container>
      </ThemeProvider>
    </>
  )
}

export default App
