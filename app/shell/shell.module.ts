import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { ShellComponent } from './shell.component';
import { NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@app/shared';
import { I18NReducer } from '@app/core/helpers/i-18n-.reducer';
import { ConfigurationReducer } from '@app/core/helpers/configuration.reducer';
import { HeaderComponent } from './navigation/header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    SharedModule,
    StoreModule.forRoot({ displayText: I18NReducer, configuration: ConfigurationReducer })
  ],
  declarations: [ShellComponent, HeaderComponent],
  providers: []
})
export class ShellModule { }
