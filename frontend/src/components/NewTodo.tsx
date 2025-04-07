import { Box, Button, TextField } from "@mui/material";
import { JSX, useState } from "react";
import { Todo } from "../types/Todo";
import { useNavigate } from "react-router";

type Props = {
  token: string;
};

function NewTodo({ token }: Props): JSX.Element {
  const navigate = useNavigate();

  const [todoName, setTodoName] = useState('');
  const [todoDescription, setTodoDescription] = useState('');

  async function createTodo() {
    if (!todoName || !todoDescription) return;
    const newTodo: Pick<Todo, 'name' | 'description'> = {
      name: todoName,
      description: todoDescription,
    };
    await fetch('http://localhost:3000/api/v1/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTodo),
    });
    navigate('/');
  }

  return (
    <Box component='form' sx={{ mb: 4, p: 2 }} onSubmit={e => { e.preventDefault(); createTodo(); }}>
      <TextField
        label="Todo Name"
        required
        fullWidth
        value={todoName}
        onChange={e => setTodoName(e.target.value)}
      />
      <TextField
        label="Description"
        required
        multiline
        maxRows={4}
        fullWidth
        sx={{ mt: 2 }}
        value={todoDescription}
        onChange={e => setTodoDescription(e.target.value)}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create Todo</Button>
    </Box>
  );
}

export default NewTodo;
