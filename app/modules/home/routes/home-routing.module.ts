import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../components/home.component';

const routes: Routes = [{ path: '', component: HomeComponent, data: { title: 'Home' } }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: []
})
export class HomeRoutingModule {}
