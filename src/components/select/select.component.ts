import { Component, ComponentState } from '../../core/component';
import './select.component.scss';

export type SelectOption = {
  id: string;
  text: string;
};

export type SelectComponentParams = {
  allowInput?: boolean;
  options?: SelectOption[];
  onChange?: () => void;
};

export class SelectComponent extends Component {
  private input: HTMLInputElement;
  private options: HTMLDivElement;
  private noOptionIndicator: HTMLElement;

  private state: ComponentState<{
    selected: string | null;
    filtered: SelectOption[];
    options: SelectOption[];
  }>;

  private onChange?: () => void;

  constructor(parent: HTMLElement, params?: SelectComponentParams) {
    super('app-select', parent);

    const allowInput = params?.allowInput ?? true;
    const options = params?.options ?? [];
    const onChange = params?.onChange;

    this.input = this.createElement('input', this.element);
    this.input.classList.add('input');
    this.input.disabled = !allowInput;

    this.options = this.createElement('div', this.element);
    this.options.classList.add('options');

    this.noOptionIndicator = this.createElement('div');
    this.noOptionIndicator.innerHTML = 'No option available';

    this.state = this.createState(
      {
        selected: null,
        filtered: options,
        options,
      },
      () => this.renderOptions(),
    );

    this.onChange = onChange;

    this.hideOptions();
    this.events();
  }

  private events() {
    this.input.addEventListener('click', () => {
      this.showOptions();
    });

    this.input.addEventListener('input', () => {
      this.debounceProcess(
        'selectInput',
        () => this.filterOptions(this.input.value),
        150,
      );
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.state.value.selected) {
        this.hideOptions();
      }
    });
  }

  private showOptions() {
    this.options.classList.remove('hidden');
  }

  private hideOptions() {
    this.options.classList.add('hidden');
  }

  private renderOptions() {
    this.options.innerHTML = '';

    const { selected, filtered, options } = this.state.value;

    if (!options.length) {
      this.options.appendChild(this.noOptionIndicator);
    } else if (this.noOptionIndicator.parentElement === this.options) {
      this.options.removeChild(this.noOptionIndicator);
    }

    for (const { id, text } of filtered) {
      const option = this.createElement('div', this.options);

      option.dataset.id = id;
      option.innerHTML = text;

      if (id === selected) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }

      option.addEventListener('click', () => {
        this.state.value.selected = id;
        this.input.value = text;
        this.hideOptions();
      });
    }
  }

  private filterOptions(value: string) {
    this.state.value.filtered = value
      ? this.state.value.options.filter(({ text }) =>
          text.toLowerCase().includes(value.toLowerCase()),
        )
      : this.state.value.options;
  }

  public setOptions(options: SelectOption[]) {
    this.state.value.options = options;
  }

  public addOptions(options: SelectOption[]) {
    const updatedOptions = [...this.state.value.options];

    for (const addOption of options) {
      updatedOptions.push(addOption);
    }

    this.state.value.options = updatedOptions;
  }

  public removeOptions(options: SelectOption[]) {
    const existingOptionIndexesByIds = new Map<string, number>();
    const updatedOptions = [...this.state.value.options];

    for (let i = 0; i < updatedOptions.length; i++) {
      existingOptionIndexesByIds.set(updatedOptions[i].id, i);
    }

    for (const removeOption of options) {
      const i = existingOptionIndexesByIds.get(removeOption.id) ?? -1;

      if (i !== -1) {
        updatedOptions.slice(i, 1);
      }
    }

    this.state.value.options = updatedOptions;
  }

  public setSelected(selected: string | null) {
    if (selected !== this.state.value.selected) {
      this.state.value.selected = selected;
      this.onChange?.();
    }
  }
}
