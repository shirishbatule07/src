import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from './shell/shell.service';
import { AppPreloadingStrategy } from './core';
import { HeaderComponent } from './shell/navigation/header.component';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: '',
      component: HeaderComponent,
      children: [
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        },
        {
          path: 'dashboard',
          loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
        },
       
        {
          path: 'master',
          loadChildren: () => import('./modules/master/master.module').then(m => m.MasterModule)
        }
      ]
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ])
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: AppPreloadingStrategy })],
  exports: [RouterModule],
  providers: [AppPreloadingStrategy]
})
export class AppRoutingModule { }
