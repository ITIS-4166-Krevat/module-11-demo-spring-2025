import {
  Box,
  Typography,
} from "@mui/material";
import { JSX, useEffect, useState } from "react";
import { Todo } from "../types/Todo";
import TodoCard from "./TodoCard";

function TodoList(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getTodos() {
      const res = await fetch('http://localhost:3000/api/v1/todos');
      const data = await res.json();
      setTodos(data);
      setIsLoading(false);
    }
    getTodos();
  }, []);

  async function updateTodo(updatedTodo: Todo): Promise<void> {
    setTodos(todos => todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    await fetch(`http://localhost:3000/api/v1/todos/${updatedTodo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    });
  }

  async function deleteTodo(todoToDelete: Todo): Promise<void> {
    setTodos(todos => todos.filter(todo => todo.id !== todoToDelete.id));
    await fetch(`http://localhost:3000/api/v1/todos/${todoToDelete.id}`, { method: 'DELETE' });
  }

  return (
    <Box sx={{ mt: 2 }}>
      {!isLoading && (
        <>
          {todos.length === 0 ? (
            <Typography variant="h4">No todos added!</Typography>
          ) : (
            <>
              {todos.map(todo => <TodoCard
                key={todo.id}
                todo={todo}
                onUpdateTodo={updateTodo}
                onDeleteTodo={deleteTodo}
              />)}
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default TodoList;
