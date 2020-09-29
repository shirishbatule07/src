import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { NotificationService } from '@app/shared/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(private oauthService: OAuthService, private notificationService: NotificationService) { }
  onLogout() {
    this.notificationService.confirm().then(({ value }) => {
      if (value) {
        this.oauthService.logOut();
      }
    });
  }
}
