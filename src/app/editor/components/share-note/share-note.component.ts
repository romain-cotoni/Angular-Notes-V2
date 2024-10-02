import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgClass } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInput, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Right } from '../../../shared/enums/right';
import { StorageService } from '../../../shared/services/storage.service';
import { EventService } from '../../../shared/services/event.service';
import { distinctUntilChanged, filter, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { Note } from '../../../shared/models/note';
import { Router } from '@angular/router';
import { NoteService } from '../../../shared/services/note.service';
import { AccountService } from '../../../shared/services/account.service';
import { User } from '../../../shared/models/user';
import { AccountNote } from '../../../shared/models/account-note';


@Component({
  selector: 'app-share-note',
  standalone: true,
  imports: [NgIf,
            NgFor,
            NgClass,
            CommonModule,
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
            MatSelectModule],
  templateUrl: './share-note.component.html',
  styleUrl: './share-note.component.scss'
})
export class ShareNoteComponent {
  readonly router         = inject(Router);
  readonly noteService    = inject(NoteService);
  readonly accountService = inject(AccountService);
  readonly eventService   = inject(EventService);
  readonly storageService = inject(StorageService);

  readonly subscriptions : Subscription[] = [];

  @ViewChild('userInput') userInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger!: MatAutocompleteTrigger;
  
  userControl  = new FormControl('');
  msgControl   = new FormControl('');

  filteredUsersOptions : Observable<User[]> = of([]);
  usersList            : User[]             = [];
  usersToShare         : User[]             = [];
  chipUsers            : string[]           = [];
  sharedUsers          : AccountNote[]      = [];
  
  
  isDevMode  : boolean = false;
  isToolTips : boolean = false;

  noteSelected  : Note | null = null;
  rightSelected : Right = Right.READ;
  right = Right;

  
  ngOnInit(): void {
    console.log("share-note.component")

    this.subscriptions.push(
      this.eventService.noteSelected$.subscribe(note => {
        this.noteSelected = note;
      }),

      this.eventService.eventIsDevMode$.subscribe(isDevMode => {
        this.isDevMode = isDevMode;
      }),
      
      this.eventService.eventIsToolTips$.subscribe(isToolTips => {
        this.isToolTips = isToolTips;
      }),
    )

    if(!this.noteSelected) {
      this.noteSelected = this.storageService.getSelectedNote();
    }

    if(!this.isDevMode) {
      this.isDevMode = this.storageService.getIsDevMode();
    }

    if(!this.isToolTips) {
      this.isToolTips = this.storageService.getIsToolTips();
    }
    
    // If noteSelected is null (after checking subscription or storage) go to editor
    if(!this.noteSelected) {
      this.router.navigate(['/editor']);
    }

    // Initialise user filter search input
    this.getUsersFiltered("username");

    // Get list of shared users for the note
    this.getSharedUsers();

  }


  getUsersFiltered(filterType: string) {
    this.filteredUsersOptions = this.userControl.valueChanges.pipe(
      distinctUntilChanged(),
      filter(searchValue => searchValue != null && typeof searchValue === 'string' && searchValue.trim() !== ''),
      switchMap(value => this.accountService.getUsersByFilter(value as string, filterType)),
      tap(users => {
        this.usersList = users;
      })
    )  
  }

  
  displayOptionUser(user: User): string {
    return user ? user.username : '';
  }


  onUserOptionsSelectionChanged(event: MatAutocompleteSelectedEvent) {
    let userSelected = event.option.viewValue;
    if(this.chipUsers.find(chipuser => chipuser === userSelected)) return;                // Check if userSelected is not already selected
    //if(this.sharedUsers.find(sharedUser => sharedUser.username === userSelected)) return; // Check if userSelected is not already shared
    let user = this.usersList.find(user => user.username === userSelected);
    if(user) {
      this.chipUsers.push(userSelected);
      this.usersToShare.push(user);
    }
    this.userInput.nativeElement.value = '';
    this.userControl.setValue(null);
  }
  
  
  addChip(event: MatChipInputEvent) {
    const userTyped = (event.value || '').trim();
    if(this.chipUsers.find(chipuser => chipuser === userTyped)) return // Check if user typed in input is not already selected
    //if(this.sharedUsers.find(sharedUser => sharedUser.username === userTyped)) return; // Check if userSelected is not already shared
    let user = this.usersList.find(user => user.username === userTyped);
    if(user) {
      this.chipUsers.push(userTyped);
      this.usersToShare.push(user);
    }
    event.chipInput.clear();
    this.userControl.setValue(null);
    this.closeAutocompletePanel();
  }
  

  removeChip(sharedUser: string) {
    const index = this.chipUsers.indexOf(sharedUser);
    if(index >= 0) {
      let user = this.usersToShare.find(user => user.username === sharedUser);
      if(user) {
        this.chipUsers.splice(index, 1);
        this.usersToShare.splice(index, 1);
      }
    }  
  }


  closeAutocompletePanel() {
    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
    }
  }
  
  
  onRightSelectionChanged(event: MatSelectChange) {
    this.rightSelected = event.value;
  }


  getSharedUsers() {
    this.accountService.getUsersByNoteId(this.noteSelected?.id as number).subscribe({
      next: (users) => {
        this.sharedUsers = users;
      },
      error: (error) => {
        console.log("Error: AccountService - getUsersByNoteId()", error);
      }
    })
  }


  setAccountNoteDto(): AccountNote[] {
    let accountNotes: AccountNote[] = [];
    this.usersToShare.forEach(userToShare => {
      let accountNote = {
        accountNoteId: { 
          accountId: userToShare?.id as number,
          noteId   : this.noteSelected?.id as number 
        },
        accountId : userToShare?.id as number,
        noteId    : this.noteSelected?.id as number,
        right     : this.rightSelected,
        message   : this.msgControl.value ?? ""
      }
      accountNotes.push(accountNote);
    })
    return accountNotes;
  }


  onShareNote() {
    this.noteService.share(this.setAccountNoteDto()).subscribe({ 
      next : (shared: boolean) => { 
        if(shared) {
          this.getSharedUsers();
          this.usersToShare = [];
          this.chipUsers = [];
          this.userControl.setValue(null);
        }
      },
      error: (error) => {
        console.log("Error: NoteService - share()", error);
        this.usersToShare = [];
        this.chipUsers = [];
        this.userControl.setValue(null);
      }
    })  
  }


  onUnshareNote(sharedUser: AccountNote) {
    let sharedUsers: AccountNote[] = [];
    sharedUsers.push(sharedUser);
    this.noteService.unshare(sharedUsers).subscribe({ 
      next : (unshared: boolean) => { 
        if(unshared) {
          this.getSharedUsers();
          this.usersToShare = [];
          this.chipUsers = [];
          this.userControl.setValue(null);
        }
      },
      error: (error) => {
        console.log("Error: NoteService - unshare()", error);
        this.usersToShare = [];
        this.chipUsers = [];
        this.userControl.setValue(null);
      }
    })  
  }


}
