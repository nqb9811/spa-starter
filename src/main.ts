import { Counter } from './components/counter/counter';
import { Spinner } from './components/spinner/spinner';

const root = document.querySelector('#app') as HTMLDivElement;
root.style.width = '500px';
root.style.height = '300px';
// root.style.position = 'absolute';
// root.style.top = '100px';
// root.style.left = '100px';

const counter = new Counter(root);
console.log(counter);

const spinner = new Spinner(root);
console.log(spinner);
spinner.show();
