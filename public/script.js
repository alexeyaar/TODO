const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

const API = '/api/todos';

async function loadTodos() {
  const res = await fetch(API);
  const todos = await res.json();
  renderTodos(todos);
}

function renderTodos(todos) {
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    li.innerHTML = `
      <input type="checkbox" ${todo.done ? 'checked' : ''} data-id="${todo.id}">
      <span class="text">${todo.text}</span>
      <button class="delete-btn" data-id="${todo.id}">Удалить</button>
    `;

    list.appendChild(li);
  });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });

  input.value = '';
  loadTodos();
});

list.addEventListener('click', async e => {
  const id = Number(e.target.dataset.id);

  if (e.target.type === 'checkbox') {
    await fetch(`${API}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: e.target.checked })
    });
    loadTodos();
  }

  if (e.target.classList.contains('delete-btn')) {
    if (!confirm('Удалить задачу?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    loadTodos();
  }
});
// ─── Загрузка случайных задач из DummyJSON ────────────────────────────────
const loadRandomBtn = document.getElementById('load-random');

loadRandomBtn.addEventListener('click', async () => {
  loadRandomBtn.disabled = true;
  loadRandomBtn.textContent = 'Загружаю...';

  try {
    const res = await fetch('https://dummyjson.com/todos?limit=5&skip=' + Math.floor(Math.random() * 200));
    if (!res.ok) throw new Error('Ошибка сети');

    const data = await res.json();
    const newTodos = data.todos.map(item => ({
      text: item.todo,
      done: item.completed
    }));

    // Добавляем в локальный список через наш же API (чтобы сразу отобразилось)
    for (const todo of newTodos) {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: todo.text })
      });
      // можно сразу отметить выполненные, но для простоты оставим как есть
    }

    loadTodos(); // обновляем список
  } catch (err) {
    console.error(err);
    alert('Не удалось загрузить задачи\n' + err.message);
  } finally {
    loadRandomBtn.disabled = false;
    loadRandomBtn.textContent = 'Загрузить 5 случайных задач из интернета';
  }
});

// первый запуск
loadTodos();