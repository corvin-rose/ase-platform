import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Like } from '../model/like';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpService) {}

  public getAllLikes(): Observable<Like[]> {
    return this.http.get<Like[]>(`${this.apiServerUrl}/likes`, true);
  }

  public getAllLikesByShaderId(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/likes/shader/${id}`, true);
  }

  public getAllLikesByUserId(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/likes/user/${id}`, true);
  }

  public addLike(like: Like): Observable<Like> {
    return this.http.post<Like>(`${this.apiServerUrl}/likes/add`, like);
  }

  public deleteLike(like: Like): Observable<Like> {
    return this.http.post<Like>(`${this.apiServerUrl}/likes/delete`, like);
  }
}
