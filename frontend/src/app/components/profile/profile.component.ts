import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';
import { SnackbarService } from '../../service/snackbar.service';
import { LikeService } from '../../service/like.service';
import { ShaderService } from '../../service/shader.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { concatMap, forkJoin, from, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  likes: number = 0;
  user: User | null = null;
  otherUserProfile: boolean = false;

  constructor(
    private likeService: LikeService,
    private shaderService: ShaderService,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];
    this.otherUserProfile = userId !== undefined;

    (userId !== undefined
      ? this.userService.getUserById(userId)
      : from(this.authService.getUserAfterAuth())
    )
      .pipe(
        concatMap((user) => {
          const shader = this.shaderService.getShaders();
          const likes = this.likeService.getAllLikes();
          return forkJoin([of(user), shader, likes]);
        })
      )
      .subscribe({
        next: ([user, shader, likes]) => {
          this.user = user;
          const userShaders = shader.filter((v) => v.authorId === user?.id).map((v) => v.id);
          this.likes = likes.filter((v) => userShaders.includes(v.shaderId)).length;
        },
        error: (error) => {
          this.snackbarService.showError(error);
        },
      });
  }

  getUsername(): string {
    return (this.user?.firstName ?? 'User') + ' ' + (this.user?.lastName ?? '');
  }

  getLikes(): number {
    return this.likes;
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
