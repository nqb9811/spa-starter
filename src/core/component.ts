const ComponentRegistry = new Map<HTMLElement, Component>();

export type ComponentState<T> = {
  value: T;
};

export class Component {
  protected element: HTMLElement;

  private parentComponent: Component | null = null;

  private childComponents = new Map<HTMLElement, Component>();

  private debounces = new Map<string, ReturnType<typeof setTimeout>>();

  constructor(tagName: string, parent: HTMLElement) {
    // Create component wrapper element
    this.element = document.createElement(tagName);

    // Attach component element to the DOM
    parent.appendChild(this.element);

    // Store component in global registry for later lookup by element
    // Must remove when component is destroyed
    ComponentRegistry.set(this.element, this);

    // Traverse upward the DOM to update parent component and child components
    let element = this.element;

    while (element.parentElement) {
      const parentComponent = ComponentRegistry.get(element.parentElement);

      if (parentComponent) {
        this.parentComponent = parentComponent;
        this.parentComponent.childComponents.set(this.element, this);
        break;
      }

      element = element.parentElement;
    }
  }

  public destroy() {
    // Remove component element from the DOM
    this.element.parentElement?.removeChild(this.element);

    // Delete component from global registry
    ComponentRegistry.delete(this.element);

    // Remove component from parent component's children
    this.parentComponent?.childComponents.delete(this.element);
  }

  public getAncestorComponent(selector: string): Component | null {
    let parentComponent = this.parentComponent;

    while (parentComponent) {
      if (parentComponent.element.matches(selector)) {
        return parentComponent;
      }

      parentComponent = parentComponent.parentComponent;
    }

    return null;
  }

  public getDescendantComponent(selector: string): Component | null {
    const traverse = (parentComponent: Component): Component | null => {
      for (const [element, childComponent] of parentComponent.childComponents) {
        if (element.matches(selector)) {
          return childComponent;
        }

        const foundComponent = traverse(childComponent);

        if (foundComponent) {
          return foundComponent;
        }
      }

      return null;
    };

    return traverse(this);
  }

  public getAllDescendantComponents(selector: string): Component[] {
    const foundComponents: Component[] = [];

    const traverse = (parentComponent: Component): Component | null => {
      for (const [element, childComponent] of parentComponent.childComponents) {
        if (element.matches(selector)) {
          foundComponents.push(childComponent);
        }

        traverse(childComponent);
      }

      return null;
    };

    return foundComponents;
  }

  public isAncestorOf(component: Component): boolean {
    const traverse = (parentComponent: Component): boolean => {
      for (const [_, childComponent] of parentComponent.childComponents) {
        if (childComponent === component) {
          return true;
        }

        const isAncestor = traverse(childComponent);

        if (isAncestor) {
          return true;
        }
      }

      return false;
    };

    return traverse(this);
  }

  public isDescendantOf(component: Component): boolean {
    let parentComponent = this.parentComponent;

    while (parentComponent) {
      if (parentComponent === component) {
        return true;
      }

      parentComponent = parentComponent.parentComponent;
    }

    return false;
  }

  protected createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    parent?: HTMLElement,
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);

    if (parent) {
      parent.appendChild(element);
    }

    return element;
  }

  protected createState<T>(
    initialValue: T,
    onChange: () => void,
    invokeOnChangeOnInit = true,
  ): ComponentState<T> {
    const state = {
      value: initialValue,
    };

    const seen = new WeakMap();

    const handler: ProxyHandler<any> = {
      get: (target, prop, receiver) => {
        const value = Reflect.get(target, prop, receiver);

        if (typeof value === 'object' && value !== null) {
          if (!seen.has(value)) {
            const proxy = new Proxy(value, handler); // wrap prop into a proxy at the 1st read
            seen.set(value, proxy);
            return proxy;
          }

          return seen.get(value);
        }

        return value;
      },
      set: (target, prop, value, receiver) => {
        const oldValue = Reflect.get(target, prop, receiver);

        if (oldValue !== value) {
          Reflect.set(target, prop, value, receiver);
          onChange();
        }

        return true; // accept the change to the original value
      },
      deleteProperty: (target, prop) => {
        if (prop in target) {
          Reflect.deleteProperty(target, prop);
          onChange();
        }

        return true; // accept the change to the original value
      },
    };

    if (invokeOnChangeOnInit) {
      setTimeout(() => onChange()); // state not initialized yet within this method
    }

    return new Proxy(state, handler);
  }

  protected debounceProcess(key: string, callback: () => void, ms: number) {
    clearTimeout(this.debounces.get(key));
    this.debounces.set(
      key,
      setTimeout(() => {
        callback();
        this.debounces.delete(key);
      }, ms),
    );
  }
}
