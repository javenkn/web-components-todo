import './todo-item.js'

const template = document.createElement('template');
template.innerHTML = `
<style>
  ul {
    padding: 0 20px 10px 0;
    width: 100%;
    max-height: 450px;
    overflow-y: auto;
  }

  input {
    width: -webkit-fill-available;
    padding: 10px;
    font-size: 1.5rem;
  }
</style>

<form>
  <input type="text" placeholder="What needs to be done?">
</form>
<ul></ul>
`;

class TodoApp extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$todoList = this._shadowRoot.querySelector('ul');
    this.$input = this._shadowRoot.querySelector('input');

    this.$form = this._shadowRoot.querySelector('form');
    this.$form.addEventListener('submit', this._addTodo.bind(this))

    this._todos = [];
  }

  _renderTodoList() {
    this.$todoList.innerHTML = '';

    this._todos.forEach((todo, index) => {
      const $todoItem = document.createElement('todo-item');
      $todoItem.setAttribute('text', todo.text);

      if (todo.done) {
        $todoItem.setAttribute('checked');
      }

      $todoItem.setAttribute('index', index);

      $todoItem.addEventListener('onRemove', this._removeTodo.bind(this));

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
}

window.customElements.define('todo-app', TodoApp);