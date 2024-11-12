import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account.service';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MessageComponent } from '../../../shared/components/message/message.component';

@Component({
  selector: 'app-lost-pwd',
  standalone: true,
  imports: [NgIf,
            ReactiveFormsModule, 
            MatIconModule, 
            MatFormFieldModule, 
            MatButtonModule, 
            MatInputModule,
            MessageComponent],
  templateUrl: './lost-pwd.component.html',
  styleUrl: './lost-pwd.component.scss'
})
export class LostPwdComponent {

  readonly router         = inject(Router);
  readonly formBuilder    = inject(FormBuilder);
  readonly accountService = inject(AccountService);

  form!   : FormGroup;
  isError : boolean = false;
  errorMsg: string  = "";

  ngOnInit() {
    console.log("login.component");
    
    this.form = this.formBuilder.group({
      'usernameControl': ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9_]{3,}$")]],
      'emailControl'   : ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")]],
    })
  }

  onLostPwd() {
    if(this.checkError()) { return; }
    let account = this.getFormControls();
    this.accountService.recoverPassword(account).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => { console.log("Error sendmail: ", error) }
    })
  }

  onGoToLogin() {
    this.router.navigate(['/login']);
  }

  onRegister() {
    this.router.navigate(['/register']);
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
    else if(this.form.get('emailControl')?.hasError('required')) {
      this.errorMsg = "Email is required";
      this.isError = true;
    }
    else if(this.form.get('emailControl')?.hasError('pattern')) {
      this.errorMsg = "Email must be only letters, numbers, and symbols @ . _ - % + ";
      this.isError = true;
    }
    
    return this.isError
  }

  
  private getFormControls() {
    return {
      'username'  : this.form.get('usernameControl')?.value,
      'email'     : this.form.get('emailControl')?.value,
    };
  }


}
