import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Buffer } from '../model/buffer';

@Injectable({
  providedIn: 'root',
})
export class BufferService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public getAllBuffersWithShaderId(shaderId: string): Observable<Buffer[]> {
    return this.http.get<Buffer[]>(`${this.apiServerUrl}/buffer/${shaderId}`);
  }

  public updateBuffers(buffers: Buffer[]): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiServerUrl}/buffer/update`, buffers);
  }
}
