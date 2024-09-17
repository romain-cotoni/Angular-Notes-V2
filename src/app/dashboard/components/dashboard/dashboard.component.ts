import { Component, inject } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatLabel],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  

  ngOnInit() {
    console.log("dashboard.component");
    
  } 
 
      
}
