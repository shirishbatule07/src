import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';

import { AlertModule, CardModule, ModalModule, LoaderComponent } from './components';
import { DataFilterPipe } from './pipes/data-filter.pipe';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
import { ClickOutsideModule } from 'ng-click-outside';
import { SpinnerComponent } from './components/spinner/spinner.component';

import 'hammerjs';
import 'mousetrap';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { GridListViewComponent } from './components/grid-list-view/grid-list-view.component';
import { NoRecordsComponent } from './components/no-records/no-records.component';
import { AuditInfoComponent } from './components/audit-info/audit-info.component';
import { NoWhitespaceDirective, NumericDirective, TrimmerDirective, InputTypeDirective } from './directives';
import { AddressComponent } from './components/address/address.component';
import { NgbTabsetModule, NgbDatepickerModule, NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { Datepicker } from './components/date-picker/date-picker.component';
import { MultiCheckSelectComponent } from './components/multi-check-select/multi-check-select.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    NgbModule,
    NgbTabsetModule,
    NgbDatepickerModule,
    CardModule,
    NgbPopoverModule,
    ModalModule,
    NgSelectModule,
    ClickOutsideModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
  ],
  exports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    NgbModule,
    NgbTabsetModule,
    CardModule,
    ModalModule,
    DataFilterPipe,
    ClickOutsideModule,
    SpinnerComponent,
    LoaderComponent,
    AutoCompleteComponent,
    PaginationComponent,
    GridListViewComponent,
    NoRecordsComponent,
    AuditInfoComponent,
    NoWhitespaceDirective,
    NumericDirective,
    InputTypeDirective,
    TrimmerDirective,
    AddressComponent,
    Datepicker,
    MultiCheckSelectComponent
  ],
  declarations: [
    DataFilterPipe,
    SpinnerComponent,
    LoaderComponent,
    AutoCompleteComponent,
    PaginationComponent,
    GridListViewComponent,
    NoRecordsComponent,
    AuditInfoComponent,
    NoWhitespaceDirective,
    NumericDirective,
    InputTypeDirective,
    TrimmerDirective,
    AddressComponent,
    Datepicker,
    MultiCheckSelectComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule { }
