import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {  CompanyListComponent, CurrencyListComponent,  ProductListComponent,  UpsertCompanyComponent,  UpsertCurrencyComponent, UpsertProductComponent } from '../components';

const routes: Routes = [
  { path: 'currency', component: CurrencyListComponent },
  { path: 'currency/add', component: UpsertCurrencyComponent },
  { path: 'currency/edit/:id', component: UpsertCurrencyComponent },
  { path: 'company', component: CompanyListComponent },
  { path: 'company/add', component: UpsertCompanyComponent },
  { path: 'company/edit/:id', component: UpsertCompanyComponent },
  { path: 'product', component: ProductListComponent },
  { path: 'product/add', component: UpsertProductComponent },
  { path: 'product/edit/:id', component: UpsertProductComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class MasterRoutingModule { }
