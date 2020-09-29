import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, NgbDropdownModule],
  declarations: [CardComponent],
  exports: [CardComponent]
  //providers: [AnimationService]
})
export class CardModule { }
