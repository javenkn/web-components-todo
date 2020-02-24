const template = document.createElement('template');
template.innerHTML = `
<style>
  footer {
    padding: 20px 20px 10px;
  }

  ul {
    list-style: none;
    display: flex;
    justify-content: space-between;
    padding: 0;
    margin: 0;
  }

  li > a {
    color: #000;
    font-size: 1.2rem;
    text-transform: uppercase;
    text-decoration: none;
  }
  
  li > a:hover {
    text-decoration: underline;
  }

  .selected {
    color: #ff3e00;
  }
</style>

<footer>
  <ul class='todo-filter'>
    <li>
      <a id='all' href="#/">All</a>
    </li>
    <li>
      <a id='active' href="#/active">
        Active
      </a>
    </li>
    <li>
      <a id='completed' href="#/completed">
        Completed
      </a>
    </li>
  </ul>
</footer>
`;

class TodoFilter extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$allFilter = this._shadowRoot.querySelector('#all');
    this.$activeFilter = this._shadowRoot.querySelector('#active');
    this.$completedFilter = this._shadowRoot.querySelector('#completed');
  }

  _renderTodoFilter() {
    const selectedFilter = this.getAttribute('filter');
    switch (selectedFilter) {
      case 'active':
        this.$allFilter.classList.remove('selected');
        this.$activeFilter.classList.add('selected');
        this.$completedFilter.classList.remove('selected');
        break;
      case 'completed':
        this.$allFilter.classList.remove('selected');
        this.$activeFilter.classList.remove('selected');
        this.$completedFilter.classList.add('selected');
        break;
      default:
        this.$allFilter.classList.add('selected');
        this.$activeFilter.classList.remove('selected');
        this.$completedFilter.classList.remove('selected');
        break;
    }
  }

  static get observedAttributes() {
    return ['filter'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    this._renderTodoFilter();
    this.dispatchEvent(new CustomEvent('onFilterChange'));
  }
}

window.customElements.define('todo-filter', TodoFilter);