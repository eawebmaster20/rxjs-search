import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos'; 
  private userApiUrl = 'https://jsonplaceholder.typicode.com/users';
  private postsApiUrl = 'https://jsonplaceholder.typicode.com/posts';
  constructor(private http: HttpClient) {}

  getTodo(term?: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(() => new Error('Error fetching data'));
      })
    );
  }


getUserDetails(userId: number): Observable<any> {
  return this.http.get<any>(`${this.userApiUrl}/${userId}`).pipe(
    catchError(error => {
      console.error('Error fetching user details:', error);
      return throwError(() => new Error('Error fetching user details'));
    })
  );
}

getUserPosts(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.postsApiUrl}?userId=${userId}`).pipe(
    catchError(error => {
      console.error('Error fetching user posts:', error);
      return throwError(() => new Error('Error fetching user posts'));
    })
  );
}
}