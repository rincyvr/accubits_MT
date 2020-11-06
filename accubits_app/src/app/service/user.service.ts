import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL ='http://localhost:8080/';
  constructor(private http: HttpClient) { }

  public userLogin(body): Observable<any> {
    
    return this.http.post<any>(`${this.baseURL}user/authenticate`, body).pipe(
      map(res => {
        return res;
      }),
      catchError((e: any) => {return throwError(e);
      })
    );
  }
  
  public userSignUp(body): Observable<any> {

    return this.http.post<any>(`${this.baseURL}user/register`, body).pipe(
      map(res => {
        return res;
      }),
      catchError((e: any) => {return throwError(e);
      })
    );
  }
}
