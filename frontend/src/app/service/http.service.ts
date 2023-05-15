import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private httpCache: Map<string, HttpObjectCache> = new Map();

  constructor(private http: HttpClient) {}

  public get<T>(url: string, cached: boolean = false): Observable<T> {
    return this.requestRouteOrLoadFromCache<T>(`GET ${url}`, () => this.http.get<T>(url), cached);
  }

  public post<T>(url: string, body: any, cached: boolean = false): Observable<T> {
    return this.requestRouteOrLoadFromCache<T>(
      `POST ${url}`,
      () => this.http.post<T>(url, body),
      cached
    );
  }

  public put<T>(url: string, body: any, cached: boolean = false): Observable<T> {
    return this.requestRouteOrLoadFromCache<T>(
      `PUT ${url}`,
      () => this.http.put<T>(url, body),
      cached
    );
  }

  public patch<T>(url: string, body: any, cached: boolean = false): Observable<T> {
    return this.requestRouteOrLoadFromCache<T>(
      `PATCH ${url}`,
      () => this.http.patch<T>(url, body),
      cached
    );
  }

  public delete<T>(url: string, cached: boolean = false): Observable<T> {
    return this.requestRouteOrLoadFromCache<T>(
      `DELETE ${url}`,
      () => this.http.delete<T>(url),
      cached
    );
  }

  private requestRouteOrLoadFromCache<T>(
    url: string,
    method: Function,
    cached: boolean
  ): Observable<T> {
    const cachedObject = this.getObjectFromCachedRoute(url);
    if (cachedObject !== null && !(cachedObject instanceof HttpQueueObject) && cached) {
      return new Observable<T>((subscriber) => {
        subscriber.next(cachedObject as T);
        subscriber.complete();
      });
    }
    if (cachedObject instanceof HttpQueueObject && cached) {
      return new Observable<T>((subscriber) => {
        let retries = 0;
        const interval = setInterval(() => {
          const queueObject = this.getObjectFromCachedRoute(url);
          if (queueObject !== null && !(queueObject instanceof HttpQueueObject)) {
            subscriber.next(queueObject as T);
            subscriber.complete();
            clearInterval(interval);
          }
          if (retries++ > 50) {
            clearInterval(interval);
            console.warn("couldn't cache request");
          }
        }, 100);
      });
    }
    this.httpCache.set(url, new HttpObjectCache(new HttpQueueObject()));
    return new Observable<T>((subscriber) => {
      method().subscribe({
        next: (object: any) => {
          this.httpCache.set(url, new HttpObjectCache(object));
          subscriber.next(object);
          subscriber.complete();
        },
        error: (err: HttpErrorResponse) => subscriber.error(err),
      });
    });
  }

  private getObjectFromCachedRoute(route: string): any | null {
    const cachedObject = this.httpCache.get(route);
    const currentTimestamp = Date.now();
    if (cachedObject !== undefined && currentTimestamp - cachedObject.timestamp <= 5 * 1000) {
      return cachedObject.object;
    }
    return null;
  }
}

class HttpObjectCache {
  object: any;
  timestamp: number;

  constructor(object: any) {
    this.object = object;
    this.timestamp = Date.now();
  }
}

class HttpQueueObject {}
