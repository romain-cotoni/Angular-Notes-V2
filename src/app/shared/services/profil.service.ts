import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  
  private isToolTipsSubject = new BehaviorSubject<boolean>(false);
  private isDevModeSubject = new BehaviorSubject<boolean>(false);
  
  isToolTips$ = this.isToolTipsSubject.asObservable();
  isDevMode$ = this.isDevModeSubject.asObservable();

  setIsToolTips(value: boolean): void {
    this.isToolTipsSubject.next(value);
  }

  setIsDevMode(value: boolean): void {
    this.isDevModeSubject.next(value);
  }



  // getIsDevMode() {
  //   return this.profil.isDevMode;
  // }

  // setIsDevMode(isDevMode: boolean) {
  //   this.profil.isDevMode = isDevMode;
  // }
}
