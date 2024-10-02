import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { StorageService } from '../../../shared/services/storage.service';
import { AccountService } from '../../../shared/services/account.service';
import { NgIf } from '@angular/common';
import { MessageComponent } from "../../../shared/components/message/message.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf,
            ReactiveFormsModule,
            MatIconModule,
            MatFormFieldModule,
            MatButtonModule,
            MatInputModule, 
            MessageComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
  readonly router         = inject(Router);
  readonly formBuilder    = inject(FormBuilder);
  readonly accountService = inject(AccountService);
  readonly storageService = inject(StorageService);

  form!    : FormGroup;
  isError  : boolean = false;
  errorMsg : string  = "";
  isLogin  : boolean = false;

  hide = signal(true);


  ngOnInit() {
    console.log("register.component")
    this.form = this.formBuilder.group({ 
      'firstnameControl': ['john'        , [Validators.required, Validators.pattern("^[a-zéèêàçA-Z' ]{1,}$")]],
      'lastnameControl' : ['doe'         , [Validators.required, Validators.pattern("^[a-zéèêàçA-Z' ]{1,}$")]],
      'usernameControl' : ['jdoe'        , [Validators.required, Validators.pattern("^[a-zA-Z0-9_]{3,}$")]],
      'emailControl'    : ['jdoe@mail.fr', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
      'passwordControl' : ['ssap'        , [Validators.required, Validators.pattern("^[a-zA-Z0-9_?!=.*+-]{4,}$")]],
      'password2Control': ['ssap'        , [Validators.required, Validators.pattern("^[a-zA-Z0-9_?!=.*+-]{4,}$")]]
    })
  }


  onHidePassword(event: MouseEvent) {
    if(!this.isLogin) {
      this.hide.set(!this.hide());
      event.stopPropagation();
    }
  }

  
  onCreateAccount() {
    if(this.checkError()) { return; }
    this.isLogin = true;
    this.storageService.clear();
    let account = this.getFormControls();
    this.accountService.createAccount(account).subscribe({
      next: () => { 
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => { 
        console.log("Error on register: ", error);
        this.isLogin = false;
        if(error.status === 409) {
          this.isError = true;
          this.errorMsg = error.error.message;
          this.errorMsg = this.errorMsg.replace('AlreadyExistException: ', '');
        }
      }
    })
  }


  onGoToLogin() {
    this.router.navigate(['/login']);
  }


  
  private checkError() {
    this.isError = false;
    this.errorMsg = "";

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

  
  private getFormControls() {
    return {
      'firstname' : this.form.get('firstnameControl')?.value,
      'lastname'  : this.form.get('lastnameControl')?.value,
      'username'  : this.form.get('usernameControl')?.value,
      'email'     : this.form.get('emailControl')?.value,
      'password'  : this.form.get('passwordControl')?.value
    };
  }

  
}
