import { Injectable } from '@angular/core';
import { Note } from '../models/note';
import { Account } from '../models/account';

const ALL_NOTES_KEY     = 'allNotesOfUser';
const SELECTED_NOTE_KEY = 'selectedNote';
const ACCOUNT_KEY       = 'account';
const IS_AUTH_KEY       = 'isAuth';
const IS_DEVMODE_KEY    = 'isDevMode';
const IS_TOOLTIPS_KEY   = 'isToolTips';
const IS_EDITABLE_KEY   = 'isEditable';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

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


  getCurrentAccount() {
    let account = sessionStorage.getItem(ACCOUNT_KEY);
    if(account) {
      return JSON.parse(account);
    }
  }

  
  setCurrentAccount(account: Account) {
    sessionStorage.removeItem(ACCOUNT_KEY);
    sessionStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }


  getSelectedNote() {
    let note = sessionStorage.getItem(SELECTED_NOTE_KEY);
    if(note) {
      return JSON.parse(note);
    } else return null;
  }


  setSelectedNote(note: Note | null) {
    sessionStorage.removeItem(SELECTED_NOTE_KEY);
    sessionStorage.setItem(SELECTED_NOTE_KEY, JSON.stringify(note));
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


  getIsToolTips(): boolean {
    return Boolean(sessionStorage.getItem(IS_TOOLTIPS_KEY));
  }


  setIsToolTips(isToolTips: boolean) {
    if(isToolTips) {
      sessionStorage.setItem(IS_TOOLTIPS_KEY, JSON.stringify(isToolTips));
    } else {
      sessionStorage.removeItem(IS_TOOLTIPS_KEY);
    }
  }


  getIsEditable(): boolean {
    return Boolean(sessionStorage.getItem(IS_EDITABLE_KEY));
  }


  setIsEditable(isEditable: boolean) {
    if(isEditable) {
      sessionStorage.setItem(IS_EDITABLE_KEY, JSON.stringify(isEditable));
    } else {
      sessionStorage.removeItem(IS_EDITABLE_KEY);
    }
  }


  clear(): void {
    sessionStorage.clear();
  }

}
