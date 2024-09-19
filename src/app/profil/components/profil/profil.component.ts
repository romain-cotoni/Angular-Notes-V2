import { Component, inject } from '@angular/core';
import { LowerCasePipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from '../../../shared/services/event.service';
import { Account } from '../../../shared/models/account';
import { AccountService } from '../../../shared/services/account.service';
import { MessageComponent } from '../../../shared/components/message/message.component';
import { NoteService } from '../../../shared/services/note.service';
import { Note } from '../../../shared/models/note';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [NgIf,
            FormsModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatInputModule, 
            MatButtonModule,
            MatIconModule,
            MatSlideToggleModule,
            LowerCasePipe,
            MessageComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {
  private eventService   = inject(EventService);
  private accountService = inject(AccountService);
  private noteService    = inject(NoteService);
  private formBuilder    = inject(FormBuilder);
  readonly dialog        = inject(MatDialog);

  form! : FormGroup;
  
  account!    : Account;
  isAdmin!    : boolean;
  isDevMode!  : boolean;
  isToolTips! : boolean;
  isEditable! : boolean;
  
  errorMsg : string  = "";
  isError  : boolean = false;
  isEdit   : boolean = false;

  nbOfNotes      : number = 0;
  nbOfSharedNotes: number = 0;


  ngOnInit() {
    console.log("profil.component");
    this.account    = this.accountService.getCurrentAccount();
    this.isAdmin    = this.account.role === "ADMIN";
    this.isDevMode  = this.account.isDevMode;
    this.isToolTips = this.account.isToolTips;
    this.isEditable = this.account.isEditable;

    this.form = this.buildForm();
    this.getNotesList();
  }


  private buildForm() {
    return this.formBuilder.group({ 
      'firstnameControl': [this.account.firstname, [Validators.required, Validators.pattern("^[a-zéèêàçA-Z' ]{1,}$")]],
      'lastnameControl' : [this.account.lastname , [Validators.required, Validators.pattern("^[a-zéèêàçA-Z' ]{1,}$")]],
      'usernameControl' : [this.account.username , [Validators.required, Validators.pattern("^[a-zA-Z0-9_]{3,}$")]],
      'emailControl'    : [this.account.email    , [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      'passwordControl' : [null                  , [Validators.required, Validators.pattern("^[a-zA-Z0-9_?!=.*+-]{4,}$")]],
      'password2Control': [null                  , [Validators.required, Validators.pattern("^[a-zA-Z0-9_?!=.*+-]{4,}$")]]
    })
  }


  getNotesList() {
    this.noteService.getNotes().subscribe({
      next: (notes) => {
        this.nbOfNotes = notes.length;
        this.nbOfSharedNotes = this.getNbOfSharedNotes(notes);
      },
      error: (error) => { 
          console.log("Error: Header -> NoteService -> getNotes(): " + error);
      }
    })
  }


  getNbOfSharedNotes(notes: Note[]) {
    let nbOfNotes = 0;
    notes.forEach( note => {
      if(note.accountNotes && note.accountNotes.length > 1) {
        nbOfNotes++;
      }
    })

    return nbOfNotes;
  }


  onEditToggleChange(event: MatSlideToggleChange) {
    this.isEdit = event.checked;
    if(this.isEdit === false) { this.isError = false; }
  }


  onDevModeToggleChange(event: MatSlideToggleChange) {
    this.setDevMode(event.checked);
  }
  

  onToolTipsToggleChange(event: MatSlideToggleChange) {
    this.setToolTips(event.checked);
  }


  onEditableToggleChange(event: MatSlideToggleChange) {
    this.setEditable(event.checked);
  }


  setDevMode(isDevMode: boolean) {
    this.account.isDevMode = isDevMode;
    this.accountService.updateAccount(this.account)
    .subscribe( account => {
      this.accountService.setCurrentAccount(account);
      this.eventService.emitIsDevMode(this.account.isDevMode);
    });
  }


  setToolTips(isToolTips: boolean) {
    this.account.isToolTips = isToolTips;
    this.accountService.updateAccount(this.account)
    .subscribe( account => {
      this.accountService.setCurrentAccount(account);
      this.eventService.emitIsToolTips(this.account.isToolTips);
    });
  }


  setEditable(isEditable: boolean) {
    this.account.isEditable = isEditable;
    this.accountService.updateAccount(this.account)
    .subscribe( account => {
      this.accountService.setCurrentAccount(account);
      this.eventService.emitIsEditable(this.account.isEditable);
    });
  }


  onEditAccount() {
    if(this.checkError()) { return; }

    let account = this.getFormValues();
    this.accountService.updateAccountIdentity(account).subscribe({
      next: (account) => {
        this.accountService.setCurrentAccount(account);
        this.account = this.accountService.getCurrentAccount();
        this.form = this.buildForm();
        this.isEdit = false;
      },
      error: (error: HttpErrorResponse) => { 
        console.log("Error - Profil edit Account: ", error);
        if(error.status === 409) {
          this.isError = true;
          this.errorMsg = error.error.message;
          this.errorMsg = this.errorMsg.replace('AlreadyExistException: ', '');
        }
      }
    })
  }


  private checkError() {
    this.isError = false;
    this.errorMsg = "Unknow error";

    if(this.form.get('firstnameControl')?.hasError('required')) {
      this.errorMsg = "Firstname is required";
      this.isError = true;
    }
    else if(this.form.get('firstnameControl')?.hasError('pattern')) {
      this.errorMsg = "Firstname must be at least 1 character, only letters";
      this.isError = true;
    }
    if(this.form.get('lastnameControl')?.hasError('required')) {
      this.errorMsg = "Lastname is required";
      this.isError = true;
    }
    else if(this.form.get('lastnameControl')?.hasError('pattern')) {
      this.errorMsg = "Lastname must be at least 1 character, only letters";
      this.isError = true;
    }
    if(this.form.get('usernameControl')?.hasError('required')) {
      this.errorMsg = "Username is required";
      this.isError = true;
    }
    else if(this.form.get('usernameControl')?.hasError('pattern')) {
      this.errorMsg = "Username must be at least 3 characters, only letters, numbers, and underscores";
      this.isError = true;
    }
    else if(this.form.get('emailControl')?.hasError('required')) {
      this.errorMsg = "Email is required";
      this.isError = true;
    }
    else if(this.form.get('emailControl')?.hasError('pattern')) {
      this.errorMsg = "Email must be only letters, numbers, and symbols @ . _ - % + ";
      this.isError = true;
    }
    else if(this.form.get('passwordControl')?.hasError('required') || this.form.get('password2Control')?.hasError('required')) {
      this.errorMsg = "Password is required";
      this.isError = true;
    }
    else if(this.form.get('passwordControl')?.hasError('pattern') || this.form.get('password2Control')?.hasError('pattern')) {
      this.errorMsg = "Password must be at least 4 characters, only letters, numbers, and symbols _ ? ! = . * + - ";
      this.isError = true;
    }
    else if(this.form.get('passwordControl')?.value !== this.form.get('password2Control')?.value) {
      this.errorMsg = "Passwords must be identical";
      this.isError = true;
    }
    return this.isError
  }


  private getFormValues() {
    return {
      firstname : this.form.get('firstnameControl')?.value,
      lastname  : this.form.get('lastnameControl')?.value,
      username  : this.form.get('usernameControl')?.value,
      email     : this.form.get('emailControl')?.value,
      password  : this.form.get('passwordControl')?.value,
      isDevMode : this.isDevMode,
      isToolTips: this.isToolTips,
      isEditable: this.isEditable
    }
  }


}