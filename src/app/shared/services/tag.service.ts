import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventService } from './event.service';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';

const BASE_URL = environment.apiUrl + '/tags';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TagService {

  readonly httpClient     = inject(HttpClient);
  readonly eventService   = inject(EventService);
  readonly storageService = inject(StorageService);

  
  getTagsByNoteId(noteId: number): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${BASE_URL}/${noteId}`);
  }


  getTagsByFilter(search: string, filter: string): Observable<Tag[]> {
    return this.httpClient.get<Tag[]>(`${BASE_URL}/filter?${filter}=${search}`);
  }


  create(tagName: string): Observable<Tag> {
    return this.httpClient.post<Tag>(BASE_URL, tagName, httpOptions);
  }


  delete(tagName: string) {
    return this.httpClient.delete(`${BASE_URL}/${tagName}`, httpOptions);
  }

  
}
