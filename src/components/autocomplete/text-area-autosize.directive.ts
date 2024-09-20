import { DOCUMENT } from '@angular/common';
import { AfterViewInit, DestroyRef, Directive, ElementRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgModel } from '@angular/forms';

const MIN_INPUT_HEIGHT = 30;

@Directive({
  selector: '[ngModel][cdkTextAreaAutoSize]',
  standalone: true,
})
export class TextAreaAutoSizeDirective implements OnInit, AfterViewInit {
  private ngModel = inject(NgModel);
  private el = inject(ElementRef);
  private destroyRef = inject(DestroyRef);
  private document = inject(DOCUMENT);

  minInputHeight = MIN_INPUT_HEIGHT;

  ngOnInit() {
    this.ngModel?.valueChanges?.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.setHeight();
    });
  }

  ngAfterViewInit() {
    this.minInputHeight = this.getMinInputHeight();
    setTimeout(() => {
      this.el.nativeElement.style.overflow = 'hidden';
      this.el.nativeElement.style.resize = 'none';
      this.setHeight();
    });
  }

  setHeight() {
    this.el.nativeElement.style.height = '0px';
    this.el.nativeElement.style.height =
      (this.el.nativeElement.scrollHeight > this.minInputHeight
        ? this.el.nativeElement.scrollHeight
        : this.minInputHeight) + 'px';
  }

  getMinInputHeight(): number {
    const minInputHeight = getComputedStyle(this.document.body).getPropertyValue(
      '--smx-input-min-height',
    );
    if (!minInputHeight) {
      return MIN_INPUT_HEIGHT;
    }

    if (String(minInputHeight).includes('px')) {
      const px = `${minInputHeight}`.replace('px', '');
      return parseInt(px);
    }

    const baseRemHeight = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const rem = `${minInputHeight}`.replace('rem', '');

    return parseFloat(rem) * baseRemHeight;
  }
}
