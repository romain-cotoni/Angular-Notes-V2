import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from '../models/account';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const BASE_URL = environment.apiUrl + '/authentication/';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private httpClient = inject(HttpClient);
  private isAuthenticatedFlag: boolean = false;
  
  constructor(private httpClient: HttpClient,
              private storageService: StorageService) {}
  
  register(account: Account): Observable<Account> {
    return this.httpClient.post<any>(BASE_URL + 'register', account, httpOptions);
  }
  
  login(account: Account): Observable<string> { 
    console.log("onAuthService login");
    const body = new FormData();
    body.append('username', account.username as string);
    body.append('password', account.password as string);
    console.log("username: ", account.username);
    console.log("password: ", account.password);
    return this.httpClient.post(BASE_URL + 'login', 
                                body, 
                                { withCredentials: true, responseType: 'text' });
  }

  logout(): Observable<any> {
    console.log("onAuthService logout");
    this.httpClient.get(BASE_URL + 'logout');
    this.isAuthenticatedFlag = false;
    return this.httpClient.post(BASE_URL + 'logout', 
                                {}, 
                                { withCredentials: true, responseType: 'text' });
  }

  isAuthenticated() {
    console.log("isAuthenticated: ", this.isAuthenticatedFlag)
    return this.isAuthenticatedFlag;
  }

  setAuthenticated(authenticated: boolean): void {
    this.isAuthenticatedFlag = authenticated;
    console.log("setAuthenticated: ", this.isAuthenticatedFlag)
  }


}
