import { SelectComponent } from './components/select/select.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

const root = document.querySelector('#app') as HTMLDivElement;
root.style.width = '500px';
root.style.height = '300px';
// root.style.position = 'absolute';
// root.style.top = '100px';
// root.style.left = '100px';

const spinner = new SpinnerComponent(root);
console.log(spinner);
// spinner.show();

const select = new SelectComponent(root, {
  allowInput: true,
  options: [
    { id: '1', text: 'One' },
    { id: '2', text: 'Two' },
  ],
});
console.log(select);
// select.addOptions([
//   { id: '3', text: 'Three' },
//   { id: '4', text: 'Four' },
//   { id: '5', text: 'Five' },
// ]);
// select.setSelected(null);
// select.setSelected('2');
