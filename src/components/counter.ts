import { Component, ComponentState } from '../core/component';
import './counter.scss';

export class Counter extends Component {
  protected btn: HTMLButtonElement;
  protected counter: ComponentState<number>;

  constructor(parentElement: HTMLElement) {
    super('app-counter', parentElement);

    this.btn = this.createElement('button', this.element);

    this.counter = this.createState<number>(
      0,
      () => {
        this.btn.innerHTML = `counter is ${this.counter.value}`;
      },
      true,
    );

    this.btn.addEventListener('click', () => {
      this.counter.value++;
    });
  }
}
