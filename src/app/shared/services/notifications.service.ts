import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private isNotificationsSubject = new BehaviorSubject<boolean>(true);
  
  isNotification$ = this.isNotificationsSubject.asObservable();
  
  setIsNotifications(value: boolean): void {
    this.isNotificationsSubject.next(value);
  }
}
