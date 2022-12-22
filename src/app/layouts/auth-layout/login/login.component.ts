import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {



  loginForm!: FormGroup;
  submitted = false;
  fieldTextType = true;

  constructor(
    private _formBuilder: FormBuilder
   ) {

    this.loginForm = this._formBuilder.group({
      email: ['', []],
      password: ['', []],
    });

   }

  ngOnInit(): void {

  }

  get f() { return this.loginForm.controls; }

  onSubmit() {

  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
