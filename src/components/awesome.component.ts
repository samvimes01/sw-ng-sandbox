import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-awesome',
  standalone: true,
  template: `
    <h3>Counter: {{ counter() }}</h3>
  `,
})
export class AppAwesome {
  counter = model.required();
}
