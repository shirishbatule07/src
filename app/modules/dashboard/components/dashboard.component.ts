import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { DashboardConfig } from '../dashboard-config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  storeSubscription: Subscription;
  displayText: any;
  dashboardConfig: any;

  constructor(private store: Store<any>) {
    this.dashboardConfig = DashboardConfig.config;
    this.storeSubscription = this.store.select('displayText').subscribe(displayText => {
      this.displayText = displayText;
    });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }
}
