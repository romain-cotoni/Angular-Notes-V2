import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  authService = inject(AuthService);
  storageService = inject(StorageService);
  router = inject(Router);

  ngOnInit() {
    this.onLogout();
  }

  onLogout(): void {
    console.log("logout component onLogout()")
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response);
        this.storageService.clear();
        this.router.navigate(['/login']);
      },
      error: (error) => { 
        console.error("Logout error: ", error); 
      },
      complete: () => {}
    });
  }
}
