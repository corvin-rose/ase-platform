import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shader } from '../model/shader';
import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ShaderService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpService) {}

  public getShaders(): Observable<Shader[]> {
    return this.http.get<Shader[]>(`${this.apiServerUrl}/shader`, true);
  }

  public getShaderById(id: string): Observable<Shader> {
    return this.http.get<Shader>(`${this.apiServerUrl}/shader/${id}`, true);
  }

  public addShader(shader: Shader): Observable<Shader> {
    return this.http.post<Shader>(`${this.apiServerUrl}/shader/add`, shader);
  }

  public updateShader(shader: Shader): Observable<Shader> {
    return this.http.put<Shader>(`${this.apiServerUrl}/shader/update`, shader);
  }

  public patchShader(shader: Shader): Observable<Shader> {
    return this.http.patch<Shader>(`${this.apiServerUrl}/shader/update`, shader);
  }

  public deleteShader(shaderId: string): Observable<Shader> {
    return this.http.delete<Shader>(`${this.apiServerUrl}/shader/delete/${shaderId}`);
  }
}
