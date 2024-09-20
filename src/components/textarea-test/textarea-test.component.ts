import { Component, signal } from '@angular/core';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { FormsModule } from '@angular/forms';
import { AutocompleteCdkComponent } from '../autocomplete/autocomplete-cdk.component';

@Component({
  selector: 'app-textareas',
  standalone: true,
  imports: [
    CdkTextareaAutosize,
    TextFieldModule,
    FormsModule,
    AutocompleteComponent,
    AutocompleteCdkComponent,
  ],
  templateUrl: './textarea-test.component.html',
  styleUrl: './textarea-test.component.scss',
})
export class TextareaTest {
  selectedHazard1 = signal('');
  selectedHazard2 = signal('');

  hazard = signal([
    { label: 'Hazard 1', value: 'Hazard 1', uid: '1' },
    { label: 'Hazard 2', value: 'Hazard 2', uid: '2' },
    { label: 'Some text 3', value: 'Some text 3', uid: '3' },
  ]);
}