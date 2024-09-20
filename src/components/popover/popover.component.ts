import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  contentChild,
  ElementRef,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from '@floating-ui/dom';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [NgTemplateOutlet],
  styleUrl: './popover.component.css',
  template: `
  <div class="smx-popover">
  <div class="smx-popover-toggle" type="button" #toggle>
    toggle
  </div>
  <div class="smx-popover-content" #content>
    @if (isOpen()) {
      <ng-container [ngTemplateOutlet]="template()" />
    }
  </div>
</div>

  `,
})
export class PopoverComponent implements AfterViewInit {
  toggle = viewChild<ElementRef>('toggle');
  content = viewChild<ElementRef>('content');

  template = contentChild.required<TemplateRef<any>>(TemplateRef<any>);

  isOpen = signal(false);

  ngAfterViewInit() {
    this.setPopover();
  }

  setPopover() {
    const button = this.toggle()?.nativeElement;
    const content = this.content()?.nativeElement;
    if (!button || !content) return;

    let cleanup = () => {
      void 0;
    };
    const update = () => {
      cleanup = autoUpdate(button, content, () => {
        computePosition(button, content, {
          // placement: 'bottom',
          middleware: [offset(4), flip(), shift({ padding: 5 })],
        }).then(({ x, y }) =>
          Object.assign(content.style, { left: `${x}px`, top: `${y}px` })
        );
      });
    };

    const toggleMenu = () => {
      this.isOpen.update((flag) => !flag);
      const opened = this.isOpen();
      if (opened) {
        content.style.display = 'block';
        update();
      } else {
        cleanup();
        content.style.display = 'none';
      }
    };

    const events = [
      [button, 'click', toggleMenu],
      [button, 'blur', toggleMenu],
    ];
    events.forEach(([el, event, listener]) => {
      el.addEventListener(event, listener);
    });
  }
}
