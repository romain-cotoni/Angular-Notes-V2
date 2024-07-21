import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    this.onLogout();
  }

  onLogout(): void {
    console.log("onLogout()")
    this.authService.logout().subscribe({
      next: (response) => {
        console.log("Logged out successfully", response);
        this.authService.setAuthenticated(false);
        this.router.navigate(['/login']);
      },
      error: (error) => { 
        console.error("Logout error: ", error); 
      },
      complete: () => {}
    });
  }
}
