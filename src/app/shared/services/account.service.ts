import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Account } from '../models/account';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { AccountNote } from '../models/account-note';
import { AccountRequestDTO } from '../models/account-request-dto';
import { StorageService } from './storage.service';
import { EventService } from './event.service';

const BASE_URL = environment.apiUrl + '/accounts';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  private httpClient     = inject(HttpClient);
  private eventService   = inject(EventService);
  private storageService = inject(StorageService);

  account!: Account;


  getCurrentAccount() {
    return this.account || this.storageService.getCurrentAccount();
  }


  setCurrentAccount(account: Account) {
    this.account = account;
    this.storageService.setCurrentAccount(this.account);
    this.eventService.emitIsDevMode(account.isDevMode);
    this.eventService.emitIsToolTips(account.isToolTips);
    this.eventService.emitIsEditable(account.isEditable);
  }


  getAccounts(): Observable<Account[]> {
    return this.httpClient.get<Account[]>(`${BASE_URL}`);
  }


  getUsersByFilter(search: string, filter: string): Observable<User[]> {
    return this.httpClient.get<User[]>(`${BASE_URL}/filter?${filter}=${search}`);
  }


  getUsersByNoteId(noteId: number): Observable<AccountNote[]> {
    return this.httpClient.get<AccountNote[]>(`${BASE_URL}/byNote/${noteId}`);
  }
  

  getAccount(accountId: string): Observable<Account> {
    return this.httpClient.get<Account>(`${BASE_URL}/${accountId}`);
  }


  createAccount(account: AccountRequestDTO): Observable<Account> {
    return this.httpClient.post<Account>(`${BASE_URL}`, account, httpOptions);
  }


  updateAccount(account: Account): Observable<Account> {
    return this.httpClient.patch<Account>(`${BASE_URL}`, account, httpOptions)
  }

  updateAccountIdentity(account: AccountRequestDTO): Observable<Account> {
    return this.httpClient.patch<Account>(`${BASE_URL}`, account, httpOptions)
  }


  deleteAccount(accountId: number) {
    return this.httpClient.delete(`${BASE_URL}/${accountId}`, httpOptions);
  }

  recoverPassword(account: AccountRequestDTO): Observable<string> {
    return this.httpClient.post<string>(`${BASE_URL}/recoverPassword`, account, httpOptions) //, { responseType: 'text' }
  }
  
}
