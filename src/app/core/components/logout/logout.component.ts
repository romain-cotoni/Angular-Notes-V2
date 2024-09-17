import { Component, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage.service';
import { NoteService } from '../../../shared/services/note.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  router         = inject(Router);
  authService    = inject(AuthService);
  noteService    = inject(NoteService);
  storageService = inject(StorageService);

  ngOnInit() {
    console.log("logout.component");
    this.onLogout();
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.noteService.setSelectedNote(null);
        this.storageService.clear();
        this.router.navigate(['/login']);
      },
      error: (error) => { console.log("Error: Logout: " + error); }
    });
  }
}
