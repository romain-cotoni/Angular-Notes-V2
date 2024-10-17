import { Component, inject, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { EventService } from '../../../shared/services/event.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgIf, 
            NgClass,
            MatButtonModule,
            MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  GITHUB_ICON   = "/images/github.png";
  GITHUB_URL    = "https://github.com/romain-cotoni";
  LINKEDIN_ICON = "/images/linkedin.png";
  LINKEDIN_URL  = "https://www.linkedin.com/in/romain-cotoni/"
  
  @Input() isDevMode : boolean | null = null;
  @Input() isToolTips: boolean = false;
  
  readonly eventService = inject(EventService);
  readonly subscriptions: Subscription[] = [];

  message: string  = "";
  isError: boolean = false;

  ngOnInit(): void {
    this.subscriptions.push(
      this.eventService.eventMessage$.subscribe( (msg: [string, boolean]) => {
        this.displayMessage(msg);
      }),
    )
  }


  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }


  displayMessage(msg: [string, boolean]) {
    this.message = msg[0];
    this.isError = msg[1];
    let timer = setInterval( () => {
      this.message = "";
      this.isError =  false;
      clearInterval(timer);
    }, 5000);
    
  }


}
