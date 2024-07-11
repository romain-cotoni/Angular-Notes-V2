import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router) {}

  ngOnInit() {
    this.form = this.formBuilder.group({ 
      'usernameControl' : [], //, [Validators.required, Validators.pattern("")]
      'passwordControl' : [],
      'password2Control': [],
      'firstnameControl': [],
      'lastnameControl' : [],
      'emailControl'    : [],
      'email2Control'   : [],
      'roleControl'     : [],
    })
  }

  onRegister() {

  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  getFormControls() {
    return {
      'username' : this.form.get('usernameControl')?.value,
      'password' : this.form.get('passwordControl')?.value,
      'password2': this.form.get('password2Control')?.value,
      'email'    : this.form.get('emailControl')?.value,
      'email2'   : this.form.get('email2Control')?.value,
    };
  }

}
