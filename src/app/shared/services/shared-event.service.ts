import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedEventService {
  private buttonClickSource = new Subject<void>();
  buttonClick$ = this.buttonClickSource.asObservable();

  emitButtonClick() {
    this.buttonClickSource.next();
  }

  
}
