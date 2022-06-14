import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shader } from '../model/shader';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShaderService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getShaders(): Observable<Shader[]> {
    return this.http.get<Shader[]>(`${this.apiServerUrl}/shader`);
  }

  public getShaderById(id: string): Observable<Shader> {
    return this.http.get<Shader>(`${this.apiServerUrl}/shader/${id}`);
  }
  
  public addShader(shader: Shader): Observable<Shader> {
    return this.http.post<Shader>(`${this.apiServerUrl}/shader/add`, shader);
  }
  
  public updateShader(shader: Shader): Observable<Shader> {
    return this.http.put<Shader>(`${this.apiServerUrl}/shader/update`, shader);
  }
  
  public deleteShader(shaderId: string): Observable<Shader> {
    return this.http.delete<Shader>(`${this.apiServerUrl}/shader/delete/${shaderId}`);
  }
}
