import { Component, signal } from '@angular/core';
import { PopoverComponent } from './components/popover/popover.component';
import { TextareaTest } from './components/textarea-test/textarea-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TextareaTest,
    PopoverComponent,
  ],
  template: `
    <app-popover>
      <ng-template>
        <p>From template</p>
      </ng-template>
    </app-popover>
    <br/><hr/>
    <app-textareas />
  `,
})
export class App {
  count = signal(0);
  updCount() {
    this.count.update((c) => c + 1);
  }

}