import { Injectable } from '@angular/core';
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
  
  constructor(private httpClient: HttpClient,
              private storageService: StorageService) {}
  
  register(account: Account): Observable<Account> {
    return this.httpClient.post<any>(BASE_URL + 'register', account, httpOptions);
  }
  
  login(account: Account): Observable<string> { 
    console.log("AuthService login");
    const body = new FormData();
    body.append('username', account.username as string);
    body.append('password', account.password as string);
    return this.httpClient.post(BASE_URL + 'login', 
                                body, 
                                { withCredentials: true, responseType: 'text' });
  }

  logout(): Observable<any> {
    console.log("AuthService logout");
    const body = {};
    return this.httpClient.post(BASE_URL + 'logout', 
                                body, 
                                { withCredentials: true, responseType: 'text' });
  }

  getIsAuthenticated(): boolean {
    const isAuth = this.storageService.getIsAuth();
    if(isAuth) { return true; }
    return false;
  }

  setIsAuthenticated(authenticated: boolean): void {
    this.storageService.setIsAuth(authenticated);
  }


}
