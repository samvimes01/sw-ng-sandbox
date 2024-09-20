import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-quiz-item',
  standalone: true,
  styles: [
    `
  button {
    background-color: wheat;
    padding: 4px 8px;
    min-width: 80px;
    margin-right: 8px
  }
  .active {
    background-color: blue;
  }
  `,
  ],
  template: `
    <h3>{{ item().question }}!</h3>
    @for (answer of answers(); track answer) {
    <button [class.active]="selected() == answer" (click)="selected.set(answer)">
      {{answer}}
    </button>
  }
  `,
})
export class QuizItemComponent {
  item = input.required<any>();
  selected = signal('');
  answers = computed(() => {
    const item = this.item();
    return [item.correct, ...item.incorrects];
  });
}
