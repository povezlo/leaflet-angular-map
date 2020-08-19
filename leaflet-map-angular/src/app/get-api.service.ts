import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetApiService {
   API = 'https://gist.githubusercontent.com/alex-oleshkevich/1509c308fabab9e104b5190dab99a77b/raw/b20bd8026deec00205a57d395c0ae1f75cc387bb/ua-cities.json'
  constructor(
    private http: HttpClient) { }

    // GET API WITH LIST OF CITY
  getArea(): Observable<any> {
    return this.http.get(this.API);
  }
}
