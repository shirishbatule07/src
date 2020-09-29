import { Component, Injectable, ViewChild, Input } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

const constants = {
  DELIMITER: '/',
  formats: {
    ddmmyyyy: `dd/mm/yyyy`
  }
};
/**
 *  Date Picker Usage:
 *
 *  In .ts file
 *  sampleForm = formBuilder.group({
 *    testDate: [null, Validators.pattern(constants.regexs.date)]
 *  });
 *
 *  In .html file
 *  <date-picker [dateControl]="sampleForm.get('testDate')"></date-picker>
 */
/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class PatheyamverAdapter extends NgbDateAdapter<string> {
  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(constants.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? `${date.day.toString().padStart(2, '0')}${constants.DELIMITER}${date.month.toString().padStart(2, '0')}${constants.DELIMITER}${date.year}` : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class PatheyamverDateParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(constants.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? `${date.day.toString().padStart(2, '0')}${constants.DELIMITER}${date.month.toString().padStart(2, '0')}${constants.DELIMITER}${date.year}` : '';
  }
}

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',

  // NOTE: For this example we are only providing current component, but probably
  // NOTE: you will want to provide your main App Module
  providers: [
    { provide: NgbDateAdapter, useClass: PatheyamverAdapter },
    { provide: NgbDateParserFormatter, useClass: PatheyamverDateParserFormatter }
  ]
})
export class Datepicker {
  @ViewChild('datePicker') datePicker: any;
  @Input() placeholder: string = constants.formats.ddmmyyyy;
  @Input('ngClass') klass: any;
  @Input() dateControl: FormControl;
  valueModel: any;

  constructor(private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  maskDate() {
    let v = this.datePicker._inputValue.replace(/\D/g, '').slice(0, 8);
    let output: any = v || null;
    if (v.length >= 5) {
      output = `${v.slice(0, 2)}${constants.DELIMITER}${v.slice(2, 4)}${constants.DELIMITER}${v.slice(4)}`;
    } else if (v.length >= 3) {
      output = `${v.slice(0, 2)}${constants.DELIMITER}${v.slice(2)}`;
    }
    this.datePicker._onChange(this.dateControl.invalid ? null : output);
    this.datePicker._elRef.nativeElement.value = output;
  }
}
