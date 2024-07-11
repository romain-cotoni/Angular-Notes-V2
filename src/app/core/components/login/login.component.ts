import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  form!: FormGroup;
  
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
