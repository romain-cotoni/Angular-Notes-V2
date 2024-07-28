import { Injectable } from '@angular/core';
import { Note } from '../models/note';

const ALL_NOTES_KEY  = 'allNotesOfUser';
const IS_AUTH_KEY    = 'isAuth';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getNotes() {
    let notes = sessionStorage.getItem(ALL_NOTES_KEY);
    if(notes) {
      return JSON.parse(notes);
    }
  }

  setNotes(notes: Note[]) {
    sessionStorage.removeItem(ALL_NOTES_KEY);
    sessionStorage.setItem(ALL_NOTES_KEY, JSON.stringify(notes));
  }

  getIsAuth(): boolean {
    return !sessionStorage.getItem(IS_AUTH_KEY);
  }

  setIsAuth(isAuth: boolean) {
    sessionStorage.removeItem(IS_AUTH_KEY);
    sessionStorage.setItem(IS_AUTH_KEY, JSON.stringify(isAuth));
  }

  /**
   * generic get item
   */
  getItem(item: string) {
    let value = window.sessionStorage.getItem(item);
    if(value) { 
      return JSON.parse(value); 
    }
    return null;
  }

}
