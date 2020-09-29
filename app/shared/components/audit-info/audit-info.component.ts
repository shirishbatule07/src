import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { format } from 'date-fns';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-audit-info',
  templateUrl: './audit-info.component.html'
})
export class AuditInfoComponent implements OnChanges, OnDestroy {
  @Input('value') value: any;
  createdByName: any;
  createdDate: any;
  lastUpdatedByName: any;
  lastUpdatedDate: any;
  displayText: any;
  private storeSubscription: Subscription;
  showUpdatedBy: boolean = false;
  constructor(private store: Store<any>) {
    this.storeSubscription = this.store.select('displayText').subscribe(displayText => {
      this.displayText = displayText;
    });
  }
  ngOnChanges() {
    if (this.value) {
      const auditInfo = this.value;
      this.createdByName = auditInfo.createdByName;
      this.createdDate = auditInfo.createdDate
        ? format(new Date(auditInfo.createdDate + 'z'), 'dd MMM yyyy hh:mm a')
        : '';
      this.lastUpdatedByName = auditInfo.lastUpdatedByName || '--';
      this.lastUpdatedDate = auditInfo.lastUpdatedDate
        ? format(new Date(auditInfo.lastUpdatedDate + 'z'), 'dd MMM yyyy hh:mm a')
        : '';

      this.showUpdatedBy = auditInfo.lastUpdatedByName?.length > 0;
    }
  }
  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }
}
