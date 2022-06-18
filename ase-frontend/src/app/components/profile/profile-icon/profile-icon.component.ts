import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, AuthService } from '../../../rest/service/auth.service';
import { User } from '../../../rest/model/user';

@Component({
  selector: 'app-profile-icon',
  templateUrl: './profile-icon.component.html',
  styleUrls: ['./profile-icon.component.css']
})
export class ProfileIconComponent {

  constructor(private authService: AuthService, private router: Router) { }

  userLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  onLogoutClick(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getProfileIconLetters(): string {
    if (Auth.user !== null) {
      let user: User = Auth.user;
      let fChar: string | undefined = user.firstName?.charAt(0);
      let lChar: string | undefined = user.lastName?.charAt(0);
      if (fChar !== undefined && lChar !== undefined) {
        return fChar + lChar;
      }
    }
    return "U";
  }
}
