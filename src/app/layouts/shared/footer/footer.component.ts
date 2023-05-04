import { Component, OnInit } from '@angular/core';
import { APP_NAME } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  title = APP_NAME;

  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
