import { Component, ComponentState } from '../../core/component';
import './select.component.scss';

export type SelectOption = {
  id: string;
  text: string;
};

export type SelectComponentParams = {
  allowInput?: boolean;
  options: SelectOption[];
};

export class SelectComponent extends Component {
  protected input: HTMLInputElement;
  protected options: HTMLDivElement;

  protected state: ComponentState<{
    selected: string | null;
    filtered: Set<string>;
    options: SelectOption[];
  }>;

  constructor(parent: HTMLElement, params?: SelectComponentParams) {
    super('app-select', parent);

    const allowInput = params?.allowInput ?? true;
    const options = params?.options ?? [];

    this.input = document.createElement('input');
    this.input.classList.add('input');
    this.input.disabled = !allowInput;
    this.element.appendChild(this.input);

    this.options = document.createElement('div');
    this.options.classList.add('options');
    this.element.appendChild(this.options);

    this.state = this.createState(
      {
        selected: null,
        filtered: new Set(),
        options,
      },
      () => this.renderOptions(),
    );
  }

  private renderOptions() {
    this.options.innerHTML = '';

    if (!this.state.value.options.length) {
      // TODO
      // return;
    }

    console.log('TODO');
  }
}
