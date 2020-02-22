const template = document.createElement('template');
template.innerHTML = `
<style>
  li {
    display: flex;
    align-items: center;
    padding: 15px;
    margin: auto;
    border-bottom: 1px solid #d0c3c3;
  }

  li > label {
    margin-right: 20px;
    font-size: 1.5rem;
  }

  li > button {
    margin: 0;
    margin-left: auto;
    font-size: 1.5rem;
  }

  li > input {
    width: 100%;
    margin: 0;
    border: 0;
    font-size: 1.5rem;
  }

  input[type="checkbox"] {
    display: none;
  }

  button {
    border: 0;
    background: none;
  }

  .done {
    text-decoration: line-through;
  }
</style>

<li class="todo-item">
  <label>
    <input class="checkbox" type="checkbox">
  </label>
  <input class="todo-edit" type="text" placeholder="What needs to be done?">
  <button>🗑</button>
</li>
`;

class TodoItem extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$item = this._shadowRoot.querySelector('.todo-item');
    this.$checkbox = this._shadowRoot.querySelector('.checkbox');
    this.$todoInput = this._shadowRoot.querySelector('.todo-edit');
    this.$removeButton = this._shadowRoot.querySelector('button');
    this.$label = this._shadowRoot.querySelector('label');

    this.$removeButton.addEventListener('click', (e) => {
      this.dispatchEvent(new CustomEvent('onRemove', { detail: this.index }));
    });
    this.$checkbox.addEventListener('click', (e) => {
      this.dispatchEvent(new CustomEvent('onToggle', { detail: this.index }));
    });
  }

  connectedCallback() {
    if (!this.hasAttribute('text')) {
      this.setAttribute('text', 'What needs to be done?');
    }

    this._renderTodoItem();
  }

  _renderTodoItem() {
    if (this.hasAttribute('checked')) {
      this.$todoInput.classList.add('done');
      this.$checkbox.setAttribute('checked', '');
      this.$label.textContent = '✅';
    } else {
        this.$todoInput.classList.remove('done');
        this.$checkbox.removeAttribute('checked');
        this.$label.textContent = '⭕️';
    }
    
    this.$todoInput.value = this._text;
  }

  static get observedAttributes() {
    return ['text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._text = newValue;
  }
}

window.customElements.define('todo-item', TodoItem);