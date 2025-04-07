import { Box, Button, Typography } from "@mui/material";
import { JSX } from "react";

type Props = {
  isLoggedIn: boolean;
  onLogout: () => void;
};

function Header({ isLoggedIn, onLogout }: Props): JSX.Element {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant='h3' gutterBottom>Todo List App</Typography>
      {isLoggedIn && <Button onClick={onLogout}>Logout</Button>}
    </Box>
  );
}

export default Header;
