import './todo-item.js';
import './todo-filter.js';

const template = document.createElement('template');
template.innerHTML = `
<style>
  ul {
    padding: 0 20px 10px 0;
    width: 100%;
    max-height: 450px;
    overflow-y: auto;
    margin: 0;
  }

  input {
    width: -webkit-fill-available;
    padding: 10px;
    font-size: 1.5rem;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
  }
</style>

<form>
  <input type="text" placeholder="What needs to be done?">
</form>
<ul></ul>
<todo-filter></todo-filter>
`;

function updateFilter(filter) {
  const hash = window.location.hash;

  if (hash === '' || hash === '#/') {
    filter.setAttribute('filter', 'all');
  } else if (hash === '#/active') {
    filter.setAttribute('filter', 'active');
  } else if (hash === '#/completed') {
    filter.setAttribute('filter', 'completed');
  }
}

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$todoList = this._shadowRoot.querySelector('ul');
    this.$input = this._shadowRoot.querySelector('input');
    this.$todoFilter = this._shadowRoot.querySelector('todo-filter');

    this.$form = this._shadowRoot.querySelector('form');
    this.$form.addEventListener('submit', this._addTodo.bind(this))

    this._todos = [];

    window.addEventListener('hashchange', function () {
      const filter = document.querySelector('todo-app').$todoFilter;
      updateFilter(filter);
    })
  }

  connectedCallback() {
    updateFilter(this.$todoFilter);
  }

  _renderTodoList() {
    this.$todoList.innerHTML = '';

    if (this._todos.length < 1) {
      this.$todoList.style
    }

    this._todos.forEach((todo, index) => {
      const $todoItem = document.createElement('todo-item');
      $todoItem.setAttribute('text', todo.text);

      if (todo.done) {
        $todoItem.setAttribute('checked', true);
      }

      $todoItem.setAttribute('index', index);

      $todoItem.addEventListener('onRemove', this._removeTodo.bind(this));
      $todoItem.addEventListener('onToggle', this._toggleTodo.bind(this));

      this.$todoList.appendChild($todoItem);
    })
  }

  _addTodo(event) {
    event.preventDefault();

    const value = this.$input.value;
    if (value === '') return;
    const todo = {
      id: Date.now(),
      text: value,
      done: false
    };
    this._todos.push(todo);
    this._renderTodoList();
    this.$input.value = '';
  }

  _removeTodo(e) {
    this._todos.splice(e.detail, 1);
    this._renderTodoList();
  }

  _toggleTodo(e) {
    const todo = this._todos[e.detail];
    this._todos[e.detail] = {...todo, done: !todo.done};
    this._renderTodoList();
  }
}

window.customElements.define('todo-app', TodoApp);