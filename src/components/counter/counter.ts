import { Component, ComponentState } from '../../core/component';
import './counter.scss';

export class Counter extends Component {
  protected btn: HTMLButtonElement;
  protected counter: ComponentState<number>;

  constructor(parent: HTMLElement) {
    super('app-counter', parent);

    this.btn = this.createElement('button', this.element);
    this.btn.addEventListener('click', () => {
      this.counter.value++;
    });

    this.counter = this.createState<number>(
      0,
      () => {
        this.btn.innerHTML = `counter is ${this.counter.value}`;
      },
      true,
    );
  }
}
