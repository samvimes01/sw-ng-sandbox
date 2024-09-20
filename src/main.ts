import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { QuizItemComponent } from './components/quiz-item.component';
import { AppAwesome } from './components/awesome.component';
import { PopoverComponent } from './components/popover/popover.component';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    QuizItemComponent,
    AppAwesome,
    PopoverComponent,
    CdkTextareaAutosize,
    TextFieldModule,
  ],
  template: `
    <!-- <h2>Questions!</h2>
    @for (item of items; track item.id) {
      <app-quiz-item [item]="item"/>
    }
    <br/>
    <br/>
    <button (click)="updCount()">Count</button>
    <br/>
    <app-awesome [counter]="count()"/>
    <br/>
    <app-popover>
      <ng-template>
        <p>From template</p>
      </ng-template>
    </app-popover> -->
    <br/><hr/>
    <textarea
      style="resize: none"
      cdkTextareaAutosize
      #autosize="cdkTextareaAutosize"></textarea>
  `,
})
export class App {
  count = signal(0);
  updCount() {
    this.count.update((c) => c + 1);
  }
  items = [
    {
      id: '1',
      question: '1 question',
      correct: 'a',
      incorrects: ['b', 'c', 'd'],
    },
    {
      id: '2',
      question: '2 question',
      correct: 'd',
      incorrects: ['a', 'b', 'c'],
    },
  ];
}

bootstrapApplication(App);
