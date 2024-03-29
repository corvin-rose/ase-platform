import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../model/user';
import { Token } from '../model/token';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpService) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/user`, true);
  }

  public getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiServerUrl}/user/${id}`, true);
  }

  public registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user/register`, user);
  }

  public loginUser(user: User): Observable<Token> {
    return this.http.post<Token>(`${this.apiServerUrl}/user/login`, user);
  }

  public authUser(token: Token): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/user/auth`, token, true);
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/user/update`, user);
  }

  public patchUser(user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiServerUrl}/user/update`, user);
  }

  public deleteUser(id: string): Observable<User> {
    return this.http.delete<User>(`${this.apiServerUrl}/user/delete/${id}`);
  }
}
