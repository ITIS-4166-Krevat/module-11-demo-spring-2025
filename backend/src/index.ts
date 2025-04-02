import express from "express";
import cors from "cors";
import { db, migrateToLatest } from "./db.js";

await migrateToLatest();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

app.get("/api/v1/todos", async (req, res) => {
  const allTodos = await db
    .selectFrom("todo")
    .select(["id", "name", "description", "isComplete"])
    .orderBy("id", "asc")
    .execute();
  res.json(allTodos);
});

app.post("/api/v1/todos", async (req, res) => {
  const { name, description } = req.body;
  if (!name || typeof name !== "string" || name.length === 0) {
    res.sendStatus(400);
    return;
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.length === 0
  ) {
    res.sendStatus(400);
    return;
  }
  const newTodo = await db
    .insertInto("todo")
    .columns(["name", "description", "isComplete"])
    .values([{ name, description, isComplete: false }])
    .returning("id")
    .executeTakeFirstOrThrow();
  res.json({ id: newTodo.id, name, description, isComplete: false });
});

app.put("/api/v1/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, isComplete } = req.body;
  if (
    !id ||
    typeof +id !== "number" ||
    Number.isNaN(+id) ||
    !Number.isSafeInteger(+id) ||
    +id <= 0
  ) {
    res.sendStatus(400);
    return;
  }
  if (!name || typeof name !== "string" || name.length === 0) {
    res.sendStatus(400);
    return;
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.length === 0
  ) {
    res.sendStatus(400);
    return;
  }
  if (isComplete == null || typeof isComplete !== "boolean") {
    res.sendStatus(400);
    return;
  }
  const todo = await db
    .selectFrom("todo")
    .select(["id", "isComplete"])
    .where("id", "=", +id)
    .executeTakeFirst();
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  await db
    .updateTable("todo")
    .set("name", name)
    .set("description", description)
    .set("isComplete", isComplete)
    .where("id", "=", +id)
    .execute();
  res.sendStatus(204);
});

app.delete("/api/v1/todos/:id", async (req, res) => {
  const { id } = req.params;
  if (
    !id ||
    typeof +id !== "number" ||
    Number.isNaN(+id) ||
    !Number.isSafeInteger(+id) ||
    +id <= 0
  ) {
    res.sendStatus(400);
    return;
  }
  const todo = await db
    .selectFrom("todo")
    .select(["id", "name", "description", "isComplete"])
    .where("id", "=", +id)
    .executeTakeFirst();
  if (!todo) {
    res.sendStatus(404);
    return;
  }
  await db.deleteFrom("todo").where("id", "=", +id).execute();
  res.json(todo);
});

app.listen(3000, () => console.log("Running on port 3000"));
