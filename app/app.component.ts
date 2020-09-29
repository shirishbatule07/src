import { Component, OnInit, OnDestroy } from '@angular/core';

import { environment } from '@env/environment';
import { Logger } from '@app/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRoute, Router } from '@angular/router';
import { LogoutService } from './shared/services/logout.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

const log = new Logger('App');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  forceLogoutSubscription: Subscription;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private store: Store<any>,
    private route: ActivatedRoute,
    private logoutService: LogoutService
  ) {
    this.route.queryParams.subscribe(params => {
      if (!location.hash.startsWith('#id_token=') && !this.isAuthenticated) {
        this.oauthService.initLoginFlow();
      }

      if (this.router.url.toString() == '/?l=1' && params.l == '1') {
        this.oauthService.initLoginFlow();
      }
    });
    // if (this.isAuthenticated) {
    //   setTimeout(() => {
    //     this.store.dispatch({
    //       type: 'add',
    //       payload: {
    //         companyId: 1233
    //       }
    //     });
    //   }, 5000);
    // }
    this.forceLogoutSubscription = logoutService.forceLogout.subscribe(flag => {
      if (flag) {
        setTimeout(() => {
          this.oauthService.initLoginFlow();
        }, 3000);
      }
    });
  }

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');
  }

  ngOnDestroy() {
    this.forceLogoutSubscription.unsubscribe();
  }

  public get isAuthenticated() {
    return this.oauthService.hasValidAccessToken();
  }
}
