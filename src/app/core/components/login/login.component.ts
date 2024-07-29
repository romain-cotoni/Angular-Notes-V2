import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Account } from '../../../shared/models/account';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  form!: FormGroup;
  account!: Account;
  //private authService = inject(AuthService);

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private storageService: StorageService) {
    
  }

  ngOnInit() {
    this.form = this.formBuilder.group({ 
      'usernameControl': ['rom1'], //, [Validators.required, Validators.pattern("")]
      'passwordControl': ['ssap'],
      'roleControl'    : ['USER'],   
    })
  }

  

  onLogin() {
    console.log("onLogin()");
    this.account = {
      "username": "rom1",
      "password": "ssap"
    };
    this.authService.login(this.account).subscribe({
      next: () => {
        this.authService.setIsAuthenticated(true);
        this.router.navigate(['/editor']);
      },
      error   : (error) => { console.log("error onLogin(): ", error) },
      complete: () => {}
    })

  }

  onRegister() {
    this.router.navigate(['/register']);
  }

  getFormControls() {
    return {
      'username': this.form.get('usernameControl')?.value,
      'password': this.form.get('passwordControl')?.value
    };
  }

}
