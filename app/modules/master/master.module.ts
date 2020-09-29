import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, NgbPopoverModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';

import { SharedModule } from '@app/shared/shared.module';
import { MasterRoutingModule } from './routes/master-routing.module';
import { CompanyListComponent, CurrencyListComponent,ProductListComponent,UpsertCompanyComponent,UpsertCurrencyComponent, UpsertProductComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgSelectModule,
    ArchwizardModule
  ],
  declarations: [
    CurrencyListComponent,
    UpsertCurrencyComponent,
    CompanyListComponent,
    UpsertCompanyComponent,
    ProductListComponent,
    UpsertProductComponent

  ]
})
export class MasterModule { }
