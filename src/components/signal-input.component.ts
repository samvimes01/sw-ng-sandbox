import { Component, model } from '@angular/core';

@Component({
  selector: 'app-sig-input',
  standalone: true,
  template: `
    <h3>Counter: {{ counter() }}</h3>
  `,
})
export class SignalInputAwesome {
  counter = model.required();
}
