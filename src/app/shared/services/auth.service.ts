import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthRequestDTO } from '../models/auth-request-dto';
import { Account } from '../models/account';

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
  
  private httpClient     = inject(HttpClient);
  private storageService = inject(StorageService);
  

  login(auth: AuthRequestDTO): Observable<Account> { 
    const body = new FormData();
    body.append('username', auth.username as string);
    body.append('password', auth.password as string);
    return this.httpClient.post<Account>(BASE_URL + 'login', body, { withCredentials: true, responseType: 'json' });
  }


  logout(): Observable<string> {
    const body = {};
    return this.httpClient.post(BASE_URL + 'logout', body, { withCredentials: true, responseType: 'text' });
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
