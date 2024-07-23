import { Injectable } from '@angular/core';
import { Note } from '../models/note';

const ALL_NOTES_KEY  = 'allNotesOfUser';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getNotes() {
    let notes = window.sessionStorage.getItem(ALL_NOTES_KEY);
    if(notes) {
      return JSON.parse(notes);
    }
    return null;
  }

  setNotes(notes: Note[]) {
    window.sessionStorage.removeItem(ALL_NOTES_KEY);
    window.sessionStorage.setItem(ALL_NOTES_KEY, JSON.stringify(notes));
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
