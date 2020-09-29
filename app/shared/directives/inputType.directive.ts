import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'input[inputType]'
})
export class InputTypeDirective {
  @Input() inputType: string;
  countryCodeDigit: number = 3;

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    switch (this.inputType) {
      case 'number': {
        this._el.nativeElement.value = this.maskNumber(initialValue);
        break;
      }
      case 'phone':
      case 'mobile': {
        this._el.nativeElement.value = this.maskPhone(initialValue);
      }
    }
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

  private maskPhone(value: any) {
    let v = value.replace(/\D/g, '').slice(0, 13);
    if (!v)
      return '';
    else if (v.length <= this.countryCodeDigit)
      return '(+' + v;
    else
      return '(+' + v.slice(0, this.countryCodeDigit) + ') ' + v.slice(this.countryCodeDigit);
  }
  private maskNumber(value: any) {
    return value.replace(/[^0-9$]*/g, '');
  }
}
