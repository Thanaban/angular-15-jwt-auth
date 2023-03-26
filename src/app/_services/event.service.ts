import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  join_activity(activityId: number, userId: number,date: Date): Observable<any> {
    return this.http.post('http://localhost:8000/users/dateAc2',
      {
        activityId,
        userId,
        date
      },
      httpOptions
    );
  }
}