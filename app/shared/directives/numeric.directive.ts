import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numeric]'
})
export class NumericDirective {
  @Input('decimals') decimals: number = 0;
  @Input('maxNumber') maxNumber: number = undefined;

  private check(value: string, decimals: number, maxNumber: number) {
    if (decimals <= 0) {
      return String(value).match(new RegExp(/^\d+$/));
    }
    else {
      var regExpString = '^\\s*((\\d+(\\.\\d{0,' + decimals + '})?)|((\\d*(\\.\\d{1,' + decimals + '}))))\\s*$';
      const hasMatchedDecimals = String(value).match(new RegExp(regExpString))
      return maxNumber ? +value <= maxNumber && hasMatchedDecimals : hasMatchedDecimals;
    }
  }

  private specialKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    const nativeElement = this.el.nativeElement;
    const newIndex = nativeElement.selectionStart;
    let current: string = nativeElement.value;
    let next: string = current.substr(0, newIndex) + event.key + current.substr(newIndex);
    if (next && !this.check(next, this.decimals, this.maxNumber)) {
      event.preventDefault();
    }
  }
}
