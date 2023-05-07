import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public requestPasswordResetFor(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiServerUrl}/password/reset/${email}`);
  }

  public resetPassword(token: string, newPassword: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiServerUrl}/password/reset/token/${token}/${newPassword}`
    );
  }
}
