import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private storageService = inject(StorageService);

  private isToolTipsSubject = new BehaviorSubject<boolean>(false);
  private isDevModeSubject = new BehaviorSubject<boolean>(false);
  
  isToolTips$ = this.isToolTipsSubject.asObservable();
  isDevMode$ = this.isDevModeSubject.asObservable();

  setIsToolTips(value: boolean): void {
    this.isToolTipsSubject.next(value);
  }

  getIsDevMode() {
    this.storageService.getIsDevMode();
  }

  setIsDevMode(value: boolean): void {
    console.log("ProfilService setIsDevMode() value: ",value)
    this.storageService.setIsDevMode(value);
    this.isDevModeSubject.next(value);
    console.log("ProfilService setIsDevMode() ", this.storageService.getIsDevMode());
  }



  // getIsDevMode() {
  //   return this.profil.isDevMode;
  // }

  // setIsDevMode(isDevMode: boolean) {
  //   this.profil.isDevMode = isDevMode;
  // }
}
