import {
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { JSX } from "react";
import { Todo } from "../types/Todo";

type Props = {
  todo: Todo;
  onUpdateTodo: (updatedTodo: Todo) => void;
  onDeleteTodo: (deletedTodo: Todo) => void;
};

function TodoCard({ todo, onUpdateTodo, onDeleteTodo }: Props): JSX.Element {
  function checkTodo() {
    const updatedTodo = { ...todo };
    updatedTodo.isComplete = !updatedTodo.isComplete;
    onUpdateTodo(updatedTodo);
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex' }}>
            <Box>
              <Checkbox checked={todo.isComplete} onChange={() => checkTodo()} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ textDecoration: todo.isComplete ? 'line-through' : undefined }}>
                {todo.name}
              </Typography>
              <Typography variant="body1">
                {todo.description}
              </Typography>
            </Box>
          </Box>
          <Box>
            <IconButton onClick={() => onDeleteTodo(todo)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TodoCard;
