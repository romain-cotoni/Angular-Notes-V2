import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from '../models/account';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const BASE_URL = environment.apiUrl + '/account/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
              private storageService: StorageService) {}
  
  register(account: Account): Observable<Account> {
    return this.httpClient.post<any>(BASE_URL + 'register', account, httpOptions);
  }
  
  login(account: Account): Observable<Account> {
    return this.httpClient.post<any>(BASE_URL + 'login', account, httpOptions);
  }

  logout(): void {
    this.httpClient.get(BASE_URL + 'logout');
  }

  isLoggedIn() {
    return true;
    //throw new Error('Method not implemented.');
  }
}
