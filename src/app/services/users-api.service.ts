import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { GetData } from '../types/users.interfase';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private readonly http = inject(HttpClient)
  private readonly url = environment.apiUrl;

  public getUsers():Observable<GetData> {
    return this.http.get<GetData>(this.url)
  }
}
