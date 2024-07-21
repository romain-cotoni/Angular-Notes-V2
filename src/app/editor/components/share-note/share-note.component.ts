import { Component, computed, inject, model, signal } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInput, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { ProfilService } from '../../../shared/services/profil.service';
//import { MatDialogTitle, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

export enum Right {
  READ = "READ",
  WRITE = "WRITE",
  OWNER = "OWNER"
}

export interface User {
  id?: number;
  username?: string;
  password?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
}

export interface UserShared {
  userId?: number;
  username?: string;
  right?: Right;
}

@Component({
  selector: 'app-share-note',
  standalone: true,
  imports: [CommonModule,
            NgIf,
            NgFor,
            NgClass,
            FormsModule,
            ReactiveFormsModule,
            MatButtonModule,
            MatIconModule,
            MatFormField,
            MatLabel,
            MatInputModule,
            MatAutocompleteModule,
            MatChipInput,
            MatChipsModule,
            MatSlideToggle,
            MatSelectModule,
            //MatDialogTitle,
            //MatDialogActions,
            //MatDialogContent
            ],
  templateUrl: './share-note.component.html',
  styleUrl: './share-note.component.scss'
})
export class ShareNoteComponent {
  isToolTips: boolean = false;
  isDevMode: boolean = false;
  right: Right = Right.READ;
  selectedRight: any;

  constructor(private profilService: ProfilService) {}

  ngOnInit(): void {
    this.profilService.isToolTips$.subscribe(value => {
      this.isToolTips = value;
    });
    this.profilService.isDevMode$.subscribe(value => {
      this.isDevMode = value;
    });
  }
  
  
  onRightsSelectionChanged(event: MatSelectChange) {
    this.selectedRight = event.value;
  }

  /*
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentUser = model('');
  readonly users = signal(['Lemon']);
  readonly allUsers: string[] = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  readonly filteredUsers = computed(() => {
    const currentUser = this.currentUser().toLowerCase();
    return currentUser
      ? this.allUsers.filter(user => user.toLowerCase().includes(currentUser))
      : this.allUsers.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our user
    if (value) {
      this.users.update(users => [...users, value]);
    }

    // Clear the input value
    this.currentUser.set('');
  }

  remove(user: string): void {
    this.users.update(users => {
      const index = users.indexOf(user);
      if (index < 0) {
        return users;
      }

      users.splice(index, 1);
      this.announcer.announce(`Removed ${user}`);
      return [...users];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.update(users => [...users, event.option.viewValue]);
    this.currentUser.set('');
    event.option.deselect();
  }

  */
  
  /*userControl = new FormControl('');
  users: string[] = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  filteredUsers: Observable<string[]>;
  selectedUsers: string[] = [];
  chipUsers: string[] = ['rom1', 'rom2', 'rom3'];

  constructor() {
    this.filteredUsers = this.userControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value ?? '') )
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter(user => user.toLowerCase().includes(filterValue));
  }
  
  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) { this.chipUsers.push(value); }

    event.chipInput!.clear();
    this.userControl.setValue(null);
  }

  removeChip(shareduser: string): void {
    const index = this.chipUsers.indexOf(shareduser);

    if(index >= 0) {
      this.chipUsers.splice(index, 1);
    }
  }*/

  /*constructor(public dialogRef: MatDialogRef<ShareNoteComponent>) {}
  
  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    this.dialogRef.close();
  }*/

}
