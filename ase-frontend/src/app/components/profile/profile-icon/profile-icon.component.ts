import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../rest/service/auth.service';

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
}
