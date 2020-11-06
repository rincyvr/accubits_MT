import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  registerForm : FormGroup;
  loginForm : FormGroup;
  userRegister = false;
  constructor(private fb: FormBuilder, private router: Router, private service : UserService) {  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['',[Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,, Validators.minLength(6)]],

    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,, Validators.minLength(6)]],

    });
  }
  onSubmit() {
    if (this.registerForm.valid) {
      this.userRegister = false;
      this.service.userSignUp(this.registerForm.value).subscribe(res => {
        this.userRegister = true;
      }, error => {
        console.log(error);
      });
    } else {

      let temp = this.registerForm.controls['name'];
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key).markAsTouched();
      });
    }

  }

  onLogin() {
    if (this.loginForm.valid) {
      this.service.userLogin(this.loginForm.value).subscribe(res => {
        console.log("User logged in",JSON.stringify(res))
      }, error => {
        console.log(error);
      });
    } else {

      let temp = this.loginForm.controls['name'];
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key).markAsTouched();
      });
    }

  }
  onRegister(){
    this.userRegister = true;
  }
  onReset(): void {
    this.registerForm.reset();
  }
  onClear(): void {
    this.loginForm.reset();
  }

}
