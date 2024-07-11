import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from '../models/account';
import { Observable } from 'rxjs';

const BASE_URL = environment.apiUrl + '/account/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  constructor(private httpClient: HttpClient) { }
  
  getAccounts(): Observable<Account[]> {
    return  this.httpClient.get<Account[]>(`${BASE_URL}`);
  }


  getAccount(accountId: string): Observable<Account> {
    return this.httpClient.get<Account>(`${BASE_URL}/${accountId}`);
  }


  createAccount(account: Account): Observable<Account> {
    return this.httpClient.post<Account>(`${BASE_URL}`, account, httpOptions);
  }


  updateAccount(account: Account): Observable<Account> {
    return this.httpClient.put<Account>(`${BASE_URL}`, account, httpOptions)
  }


  deleteAccount(accountId: string) {
    return this.httpClient.delete(`${BASE_URL}/${accountId}`, httpOptions);
  }
  
}
