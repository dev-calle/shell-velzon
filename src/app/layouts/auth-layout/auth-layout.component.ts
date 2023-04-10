import { Component, OnInit } from '@angular/core';
import { APP_NAME } from 'src/constants/app.constants';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

  title = APP_NAME;

  // set the current year
  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
