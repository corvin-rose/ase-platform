import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user';

@Component({
  selector: 'app-profile-icon',
  templateUrl: './profile-icon.component.html',
  styleUrls: ['./profile-icon.component.css'],
})
export class ProfileIconComponent implements OnInit {
  user: User | null = null;
  loading: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loading = true;
    const interval = setInterval(() => {
      this.authService.getUserAfterAuth().then((user) => {
        this.user = user;
        if (user !== null) {
          clearInterval(interval);
          this.loading = false;
        }
      });
    }, 500);
  }

  userLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  onLogoutClick(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getProfileIconLetters(): string {
    if (this.user !== null) {
      let user: User = this.user;
      let fChar: string | undefined = user.firstName?.charAt(0);
      let lChar: string | undefined = user.lastName?.charAt(0);
      if (fChar !== undefined && lChar !== undefined) {
        return fChar + lChar;
      }
    }
    return '';
  }
}
