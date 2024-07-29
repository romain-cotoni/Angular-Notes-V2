import { Injectable } from '@angular/core';
import { Note } from '../models/note';

const ALL_NOTES_KEY  = 'allNotesOfUser';
const IS_AUTH_KEY    = 'isAuth';
const IS_DEVMODE_KEY = 'isDevMode';

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
    return Boolean(sessionStorage.getItem(IS_AUTH_KEY));
  }

  setIsAuth(isAuth: boolean) {
    if(isAuth) {
      sessionStorage.setItem(IS_AUTH_KEY, JSON.stringify(isAuth));
    } else {
      sessionStorage.removeItem(IS_AUTH_KEY);
    }
  }

  getIsDevMode(): boolean {
    return Boolean(sessionStorage.getItem(IS_DEVMODE_KEY));
  }

  setIsDevMode(isDevMode: boolean) {
    if(isDevMode) {
      sessionStorage.setItem(IS_DEVMODE_KEY, JSON.stringify(isDevMode));
    } else {
      sessionStorage.removeItem(IS_DEVMODE_KEY);
    }
  }

  clear(): void {
    sessionStorage.clear();
  }

  /**
   * generic get item
   */
  /*getItem(item: string) {
    let value = window.sessionStorage.getItem(item);
    if(value) { 
      return JSON.parse(value); 
    }
    return null;
  }*/

}
