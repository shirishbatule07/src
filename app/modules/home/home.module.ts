import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared/shared.module';
import { HomeRoutingModule } from './routes/home-routing.module';
import { HomeComponent } from './components/home.component';

@NgModule({
	imports: [CommonModule, HomeRoutingModule, SharedModule],
	declarations: [HomeComponent]
})
export class HomeModule {}
