import { Component } from '../../core/component';
import './spinner.component.scss';

export class SpinnerComponent extends Component {
  protected spinner: HTMLDivElement;

  constructor(parent: HTMLElement) {
    super('app-spinner', parent);

    this.spinner = this.createElement('div', this.element);
    this.spinner.classList.add('spinner');
    this.element.appendChild(this.spinner);

    this.hide();
  }

  public show() {
    if (!this.element.parentElement) {
      return;
    }

    // Parent element must be positioned relative
    this.element.parentElement.style.position = 'relative';

    // Component wrapper element is used as an overlay
    const { offsetWidth, offsetHeight } = this.element.parentElement;
    this.element.style.width = offsetWidth + 'px';
    this.element.style.height = offsetHeight + 'px';

    this.element.classList.remove('hidden');
  }

  public hide() {
    this.element.classList.add('hidden');
  }
}
