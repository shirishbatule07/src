import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';
import { DashboardRoutingModule } from './routes/dashboard-routing.module';
import { DashboardComponent } from './components/dashboard.component';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, SharedModule, NgbTabsetModule],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
