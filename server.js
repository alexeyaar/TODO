const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// В памяти храним задачи (при перезапуске пропадут — это нормально для демо)
let todos = [
  { id: 1, text: "Изучить git rebase", done: false },
  { id: 2, text: "Настроить первый pipeline в GitLab", done: false }
];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── API ────────────────────────────────────────────────

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Текст задачи обязателен' });
  }

  const newTodo = {
    id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    text: text.trim(),
    done: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  if ('done' in req.body) {
    todo.done = !!req.body.done;
  }

  if (req.body.text && typeof req.body.text === 'string') {
    todo.text = req.body.text.trim();
  }

  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Задача не найдена' });
  }

  todos.splice(index, 1);
  res.status(204).end();
});

// Отдаём index.html на все остальные пути (SPA-style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});