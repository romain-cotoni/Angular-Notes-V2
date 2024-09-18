import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgClass],
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
  
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
    
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
