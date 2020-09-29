import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  Component,
  OnInit,
  Input,
  forwardRef,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, concat, Subscription } from 'rxjs';
import { tap, distinctUntilChanged, switchMap, debounceTime, filter, finalize, catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true
    }
  ],
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {
  @ViewChild('select', { static: true }) ngSelectComp: NgSelectComponent;
  @Input() items: any;
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() apiCall: Function;
  @Input() inputAttrs: { [key: string]: string };
  @Input() placeholder: string = '';
  @Input() dataLoader: boolean = false;
  @Input() baseContext: any;
  @Input() disabled: boolean = false;
  @Input('ngClass') klass: any;
  @Output() onSelect = new EventEmitter();
  options$: Observable<any>;
  storeSubscription: Subscription;
  dataLoading: boolean = false;
  termInput$ = new Subject<string>();
  selectedOptionModel: any;
  displayText: any;

  get selectedOption(): any {
    return this.selectedOptionModel;
  }

  set selectedOption(obj: any) {
    if (obj !== this.selectedOptionModel) {
      this.selectedOptionModel = obj;
      this.onChange(obj);
      this.onSelect.emit(this.selectedOptionModel);
    }
  }

  constructor(private store: Store<any>) {
    this.storeSubscription = this.store.select('displayText').subscribe(displayText => {
      this.displayText = displayText;
    });
  }

  ngOnInit() {
    this.inputAttrs &&
      Object.keys(this.inputAttrs).forEach(key => {
        this.ngSelectComp.searchInput.nativeElement.setAttribute(key, this.inputAttrs[key]);
      });
    if (this.apiCall) {
      this.options$ = concat(
        of([]),
        this.termInput$.pipe(
          distinctUntilChanged(),
          filter(term => term != null || term != undefined),
          tap(() => {
            this.dataLoader && (this.dataLoading = true);
          }),
          debounceTime(50),
          switchMap((term: string) => {
            return this.apiCall(this.baseContext, term).pipe(
              catchError(() => of([])),
              finalize(() => this.dataLoader && (this.dataLoading = false))
            );
          })
        )
      );
    }
  }

  onOpen() {
    //if (this.apiCall && !this.ngSelectComp.items.length) {
    this.termInput$.next('');
    //}
  }

  ngOnChanges() {
    if (this.items) {
      this.options$ = of(this.items);
    }
  }

  onChange = (_: any) => { };

  writeValue(obj: any): void {
    this.selectedOption = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
    this.termInput$.unsubscribe();
    this.onSelect.unsubscribe();
  }
}
