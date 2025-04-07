import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { db, migrateToLatest } from './db.js';

await migrateToLatest();

const users = [
  {
    userId: 1,
    username: 'bob',
    password: 'abc',
  },
  {
    userId: 2,
    username: 'alice',
    password: 'def',
  },
];

const app = express();

app.use(cors());

app.use(express.json());

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (
    !username ||
    typeof username !== 'string' ||
    !password ||
    typeof password !== 'string'
  ) {
    res.sendStatus(401);
    return;
  }
  const matchingUser = users.find((u) => u.username === username);
  if (!matchingUser) {
    res.sendStatus(401);
    return;
  }
  if (matchingUser.password !== password) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({ userId: matchingUser.userId }, 'abcdef', {
    expiresIn: '24h',
  });
  res.json({ token });
});

app.use('/api/v1', (req, res, next) => {
  const authHeader = req.get('Authorization'); // Bearer JWT
  if (!authHeader) {
    res.sendStatus(401);
    return;
  }
  const authSegments = authHeader.split(' ');
  if (authSegments.length !== 2 || authSegments[0] !== 'Bearer') {
    res.sendStatus(401);
    return;
  }
  const token = authSegments[1];
  try {
    const decodedToken = jwt.verify(token, 'abcdef');
    res.locals.userId = (decodedToken as Record<string, unknown>).userId;
    next();
  } catch (err) {
    res.sendStatus(401);
  }
});

app.get('/api/v1/todos', async (req, res) => {
  const allTodos = await db
    .selectFrom('todo')
    .select(['id', 'name', 'description', 'isComplete'])
    .orderBy('id', 'asc')
    .where('userId', '=', res.locals.userId)
    .execute();
  res.json(allTodos);
});

app.post('/api/v1/todos', async (req, res) => {
  const { name, description } = req.body;
  if (!name || typeof name !== 'string' || name.length === 0) {
    res.sendStatus(400);
    return;
  }
  if (
    !description ||
    typeof description !== 'string' ||
    description.length === 0
  ) {
    res.sendStatus(400);
    return;
  }
  const newTodo = await db
    .insertInto('todo')
    .columns(['name', 'description', 'isComplete'])
    .values([
      { name, description, isComplete: false, userId: res.locals.userId },
    ])
    .returning('id')
    .executeTakeFirstOrThrow();
  res.json({ id: newTodo.id, name, description, isComplete: false });
});

app.put('/api/v1/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, isComplete } = req.body;
  if (
    !id ||
    typeof +id !== 'number' ||
    Number.isNaN(+id) ||
    !Number.isSafeInteger(+id) ||
    +id <= 0
  ) {
    res.sendStatus(400);
    return;
  }
  if (!name || typeof name !== 'string' || name.length === 0) {
    res.sendStatus(400);
    return;
  }
  if (
    !description ||
    typeof description !== 'string' ||
    description.length === 0
  ) {
    res.sendStatus(400);
    return;
  }
  if (isComplete == null || typeof isComplete !== 'boolean') {
    res.sendStatus(400);
    return;
  }
  const todo = await db
    .selectFrom('todo')
    .select(['id', 'isComplete', 'userId'])
    .where('id', '=', +id)
    .where('userId', '=', res.locals.userId)
    .executeTakeFirst();
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  await db
    .updateTable('todo')
    .set('name', name)
    .set('description', description)
    .set('isComplete', isComplete)
    .where('id', '=', +id)
    .execute();
  res.sendStatus(204);
});

app.delete('/api/v1/todos/:id', async (req, res) => {
  const { id } = req.params;
  if (
    !id ||
    typeof +id !== 'number' ||
    Number.isNaN(+id) ||
    !Number.isSafeInteger(+id) ||
    +id <= 0
  ) {
    res.sendStatus(400);
    return;
  }
  const todo = await db
    .selectFrom('todo')
    .select(['id', 'name', 'description', 'isComplete', 'userId'])
    .where('id', '=', +id)
    .where('userId', '=', res.locals.userId)
    .executeTakeFirst();
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  await db.deleteFrom('todo').where('id', '=', +id).execute();
  res.json(todo);
});

app.listen(3000, () => console.log('Running on port 3000'));
