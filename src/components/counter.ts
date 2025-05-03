import { Component, ComponentState } from '../core/component';
import './counter.scss';

export class Counter extends Component {
  protected btn: HTMLButtonElement;
  protected counter: ComponentState<number>;

  constructor(parentElement: HTMLElement) {
    super('app-counter', parentElement);

    // Template
    this.btn = this.createElement('button', this.element);

    // State
    this.counter = this.createState<number>(
      0,
      () => {
        this.btn.innerHTML = `counter is ${this.counter.value}`;
      },
      true,
    );

    // Event
    this.btn.addEventListener('click', () => {
      this.counter.value++;
    });
  }
}
