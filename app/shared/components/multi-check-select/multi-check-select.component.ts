import { Component, OnInit, Input, Output, OnDestroy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { omit } from 'lodash';
/**
 Usage of this component

 in .html file
 <app-multi-check-select [items]="<array of object containing label and value>"
  [onChange]="handleOnChange($event)" -- function to get selected options
  [selected]="<array of object containing label and value to display in component>"
  label="<property-name-to-be-displayed-as-label>" // default value is 'label' //
  uid="<property-name-having-unique-value>"        // default value is 'id' //
  ></app-multi-check-select>

**/

@Component({
  selector: 'app-multi-check-select',
  templateUrl: './multi-check-select.component.html',
  styleUrls: ['./multi-check-select.component.scss']
})
export class MultiCheckSelectComponent implements OnInit, OnChanges, OnDestroy {
  @Input() takeFirst: number = 1;
  @Input() fieldLabel: string = 'Multi Check Select';
  @Input() items: Array<any> = [];
  @Input() selected: Array<any> = [];
  @Input() placement: string = "bottom-right";
  @Input() disabled: boolean = false;
  @Input() label: string = 'label';
  @Input() uid: string = 'id';
  @Output() onChange = new EventEmitter();
  tempItem: Array<any> = [];
  displayLabel: string = '';
  displayText: any;
  storeSubscription: Subscription;


  constructor(
    private store: Store<any>
  ) {
    this.storeSubscription = this.store.subscribe(state => {
      this.displayText = state.displayText;
    });
  }

  get isAllSelected() {
    return this.selected.length === this.items.length;
  }

  ngOnInit(): void {
    this.tempItem = this.items.slice();
    this.update();
    this.updateDisplayLabel();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.items) {
      this.items = changes.items.currentValue;
    }
    if (changes.selected) {
      this.selected = changes.selected.currentValue;
      this.update();
      this.updateDisplayLabel();
    }
    if (this.selected) {
      this.update();
      this.updateDisplayLabel();
    }
  }

  toggleAllSelect($event) {
    this.selected = this.isAllSelected ? [] : this.items.slice();
    this.update();
    this.updateDisplayLabel();
    this.emit();
  }

  update() {
    this.tempItem = this.tempItem.map((item: any) => {
      return this.selected.find((val: any) => val[this.uid] === item[this.uid]) ?
        { ...item, checked: true } : { ...item, checked: false };
    });
  }

  updateDisplayLabel() {
    this.displayLabel = this.selected?.slice(0, this.takeFirst).map((item: any) => item[this.label]).join(',');
    if (this.selected.length > this.takeFirst) {
      this.displayLabel = this.displayLabel.concat(` (+${this.selected.length - this.takeFirst})`);
    }
  }

  handleOnInput(value) {
    this.tempItem = this.items.filter((item: any) => item[this.label].toLowerCase().includes(value.toLowerCase()));
    this.update();
  }

  handleOnCheck($event, value) {
    const { checked } = $event.target;
    checked ? this.selected.push(omit(value, ['checked']))
      : (this.selected = this.selected.filter((item: any) => item[this.uid] !== value[this.uid]));
    this.update();
    this.updateDisplayLabel();
    this.emit();
  }

  handleParentClick($event) {
    this.handleOnInput('');
  }

  handleClearInput(searchInput: any) {
    searchInput.value = '';
    this.handleOnInput('');
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  emit() {
    this.onChange.emit(this.selected);
  }
}
