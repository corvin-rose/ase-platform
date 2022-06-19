import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Like } from "../model/Like";

@Injectable({
  providedIn: "root",
})
export class LikeService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public getAllLikes(): Observable<Like[]> {
    return this.http.get<Like[]>(`${this.apiServerUrl}/likes`);
  }

  public getAllLikesByShaderId(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/likes/shader/${id}`);
  }

  public getAllLikesByUserId(id: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiServerUrl}/likes/user/${id}`);
  }

  public addLike(like: Like): Observable<Like> {
    return this.http.post<Like>(`${this.apiServerUrl}/likes/add`, like);
  }

  public deleteLike(like: Like): Observable<Like> {
    return this.http.post<Like>(`${this.apiServerUrl}/likes/delete`, like);
  }
}
