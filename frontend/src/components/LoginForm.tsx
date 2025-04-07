import { Box, Button, TextField, Typography } from "@mui/material";
import { JSX, useState } from "react";

type Props = {
  onLogin: (token: string) => void;
};

function LoginForm({ onLogin }: Props): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasFailedLogin, setHasFailedLogin] = useState(false);

  function handleUpdateUsername(value: string) {
    setUsername(value);
    setHasFailedLogin(false);
  }

  function handleUpdatePassword(value: string) {
    setPassword(value);
    setHasFailedLogin(false);
  }

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username || !password) return;
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.status !== 200) {
      setHasFailedLogin(true);
      return;
    }
    const data = await res.json();
    onLogin(data.token);
  }

  return (
    <>
      <Box component='form' sx={{ mb: 4, p: 2 }} onSubmit={handleLoginSubmit}>
        <TextField
          label="Username"
          sx={{ mb: 2 }}
          required
          fullWidth
          value={username}
          onChange={e => handleUpdateUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          value={password}
          onChange={e => handleUpdatePassword(e.target.value)}
        />
        {hasFailedLogin && <Typography variant="h5">Login failed!</Typography>}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
      </Box>
    </>
  );
}

export default LoginForm;
