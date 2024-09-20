/* eslint-disable @typescript-eslint/no-explicit-any */
import { OverlayModule } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  untracked,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter, fromEvent, Observable } from 'rxjs';

import { TextAreaAutoSizeDirective } from './text-area-autosize.directive';
import { HighlightPipe } from './highlight.pipe';

const isArrowUp = (e: KeyboardEvent) => e.key === 'ArrowUp';
const isArrowDown = (e: KeyboardEvent) => e.key === 'ArrowDown';
const isArrowUpDown = (e: KeyboardEvent) => isArrowUp(e) || isArrowDown(e);
const isEnter = (e: KeyboardEvent) => e.key === 'Enter';
const isESC = (e: KeyboardEvent) => e.key === 'Escape';
const isTab = (e: KeyboardEvent) => e.key === 'Tab';

export type AutocompleteItem<T = any> = T & {
  uid: string;
  label: string;
  value: any;
  selected?: boolean;
  [key: string]: any;
};

@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
  imports: [FormsModule, NgTemplateOutlet, HighlightPipe, TextAreaAutoSizeDirective, OverlayModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteComponent implements ControlValueAccessor, AfterViewInit {
  private destroyRef = inject(DestroyRef);

  private searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  data = input<AutocompleteItem[]>([]);
  searchByValue = input(true);

  showClearBtn = input(false);

  inputId = input<string>('');
  disabled = input(false);
  placeholder = input('');
  pattern = input('');
  maxlength = input<string>('');
  isMultiline = input(false);

  notFoundTemplate = input<TemplateRef<any>>();

  opened = output<void>();
  closed = output<void>();
  selected = output<AutocompleteItem>();

  filteredListElement = viewChild<ElementRef<HTMLUListElement>>('filteredListElement');

  value = model<string>(''); // ngModel value and filter value

  isOpen = signal(false);
  selectedIdx = signal(-1);
  notFound = signal(false);
  uid = 'uniqueId' + Date.now();
  searchKey = computed(() => (this.searchByValue() ? 'value' : 'label'));
  searchInputWidth = computed(() => this.searchInput()?.nativeElement?.offsetWidth ?? 400);

  filteredList = computed(() => {
    const query = this.value();
    const searchKey = this.searchKey();

    return this.data().filter(
      item => item[searchKey].toLowerCase().indexOf(query.toLowerCase()) > -1,
    );
  });
  inputKeyDown$!: Observable<KeyboardEvent>;

  constructor() {
    effect(() => {
      const list = this.filteredList();
      untracked(() => {
        this.selectedIdx.set(-1);
        this.notFound.set(list.length === 0);
      });
    });

    effect(() => {
      const val = this.value();
      if (val == null) return;
      this.onChange(val);
    });
  }

  ngAfterViewInit(): void {
    const elem = this.searchInput()?.nativeElement;
    if (!elem) return;

    this.inputKeyDown$ = fromEvent<KeyboardEvent>(elem, 'keydown');
    this.listenEventStream();
  }

  listenEventStream() {
    this.inputKeyDown$
      .pipe(
        filter(e => isArrowUpDown(e)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(e => {
        e.preventDefault();
        const isUp = isArrowUp(e);
        this.onFocusItem(e, isUp);
      });

    this.inputKeyDown$
      .pipe(
        filter(e => isEnter(e)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.onEnter());

    this.inputKeyDown$
      .pipe(
        filter(e => isESC(e) || isTab(e)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.handleClose());
  }

  handleFocus(e) {
    if (!this.data().length) return;
    this.isOpen.set(true);
    this.opened.emit();
  }

  handleClose() {
    this.isOpen.set(false);
    this.selectedIdx.set(-1);
    this.notFound.set(false);
    this.searchInput()?.nativeElement.blur();
    this.closed.emit();
  }

  select(item: AutocompleteItem) {
    this.onChange(item.value);
    this.writeValue(item.value);
    this.selected.emit(item);

    this.handleClose();
  }

  onEnter() {
    const idx = this.selectedIdx();
    if (idx > -1) {
      this.select(this.filteredList()[idx]);
    }
    this.handleClose();
  }

  onFocusItem(e, isUp: boolean) {
    // move arrow up and down on filteredList
    const totalNumItem = this.filteredList().length;
    const idx = this.selectedIdx();
    if (isUp) {
      if (idx == -1) {
        this.selectedIdx.set(0);
      }
      this.selectedIdx.set((totalNumItem + idx - 1) % totalNumItem);
    } else {
      const sum = idx === null ? 0 : idx + 1;
      this.selectedIdx.set((totalNumItem + sum) % totalNumItem);
    }
    this.scrollToFocusedItem(this.selectedIdx());
  }

  scrollToFocusedItem(index) {
    const listElement = this.filteredListElement()?.nativeElement;
    if (!listElement) return;
    const items = Array.prototype.slice.call(listElement.childNodes).filter((node: any) => {
      if (node.nodeType === 1) {
        // if node is element
        return node.className.includes('item');
      } else {
        return false;
      }
    });
    if (!items.length) {
      return;
    }
    const listHeight = listElement.offsetHeight;
    const itemHeight = items[index].offsetHeight;
    const visibleTop = listElement.scrollTop;
    const visibleBottom = listElement.scrollTop + listHeight - itemHeight;
    const targetPosition = items[index].offsetTop;
    if (targetPosition < visibleTop) {
      listElement.scrollTop = targetPosition;
    }
    if (targetPosition > visibleBottom) {
      listElement.scrollTop = targetPosition - listHeight + itemHeight;
    }
  }

  remove(e: Event) {
    e.stopPropagation();
    this.onChange('');
    this.writeValue('');

    this.isOpen.set(false);
    this.notFound.set(false);
  }

  // implements ControlValueAccessor
  writeValue(value) {
    if (value == null) return;
    this.value.set(value);
  }
  onChange(_: unknown) {
    void _;
  }
  onTouched(_: unknown) {
    void _;
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
}
