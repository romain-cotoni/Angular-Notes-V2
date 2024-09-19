import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthRequestDTO } from '../../../shared/models/auth-request-dto';
import { Account } from '../../../shared/models/account';
import { AccountService } from '../../../shared/services/account.service';
import { MessageComponent } from "../../../shared/components/message/message.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf,
            ReactiveFormsModule, 
            MatIconModule, 
            MatFormFieldModule, 
            MatButtonModule, 
            MatInputModule,
            MessageComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private router         = inject(Router);
  private formBuilder    = inject(FormBuilder);
  private authService    = inject(AuthService);
  private accountService = inject(AccountService);

  form!: FormGroup;

  isError: boolean = false;
  errorMsg: string = ""; 
  isLogin: boolean = false;

  hide = signal(true);

  ngOnInit() {
    console.log("login.component");
    
    this.form = this.formBuilder.group({
      'usernameControl': ['rom1', [Validators.required, Validators.pattern("^[a-zA-Z0-9_]{3,}$")]],
      'passwordControl': ['ssap', [Validators.required, Validators.pattern("^[a-zA-Z0-9_?!=.*+-]{4,}$")]],
      'roleControl'    : ['USER', [Validators.required, Validators.pattern("^(GUEST|USER|ADMIN)$")]],   
    })
  }


  onHidePassword(event: MouseEvent) {
    if(!this.isLogin) {
      this.hide.set(!this.hide());
      event.stopPropagation();
    }
  }

  
  onLogin() {
    if(this.checkError()) { return; }
    this.isLogin = true;
    let auth: AuthRequestDTO = this.getFormControls();
    
    this.authService.login(auth).subscribe({
      next: (account: Account) => {
        console.log("login response - account : ",account)
        this.authService.setIsAuthenticated(true);
        this.accountService.setCurrentAccount(account);
        this.router.navigate(['/editor']);
      },
      error: (error) => { 
        console.log("Error onLogin(): ", error) 
        this.isLogin = false; 
      }
    })
  }
  
  
  onRegister() {
    this.router.navigate(['/register']);
  }


  onLostPassword() {
    this.router.navigate(['/lost-pwd']);
  }
  
  
  private checkError() {
    this.isError = false;
    this.errorMsg = "";

    if(this.form.get('usernameControl')?.hasError('required')) {
      this.errorMsg = "Username is required";
      this.isError = true;
    }
    else if(this.form.get('usernameControl')?.hasError('pattern')) {
      this.errorMsg = "Username must be at least 3 characters, only letters, numbers, and underscores";
      this.isError = true;
    }
    else if(this.form.get('passwordControl')?.hasError('required')) {
      this.errorMsg = "Password is required";
      this.isError = true;
    }
    else if(this.form.get('passwordControl')?.hasError('pattern')) {
      this.errorMsg = "Password must be at least 4 characters, only letters, numbers, and symbols _ ? ! = . * + - ";
      this.isError = true;
    }
    return this.isError;
  }


  private getFormControls() {
    return {
      'username': this.form.get('usernameControl')?.value,
      'password': this.form.get('passwordControl')?.value,
    };
  }

}
