import { Component, inject, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { EventService } from '../../../shared/services/event.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  private subscriptions: Subscription[] = [];
  
  @Input() isDevMode : boolean | null = null;
  @Input() isToolTips: boolean = false;

  ngOnInit(): void {
    this.subscriptions.push(
    
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
