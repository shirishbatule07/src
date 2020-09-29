import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input'
})
export class TrimmerDirective {
  @Input() type: string;

  constructor(private el: ElementRef) { }

  @HostListener('blur', ['$event'])
  onInputBlur(event) {
    if (this.type === 'text') {
      let value: string = this.el.nativeElement.value;
      this.el.nativeElement.value = value.trim();
    }
  }
}
