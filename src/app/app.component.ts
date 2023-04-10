import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading$ = this._loaderService.loading$;

  constructor(private _loaderService: LoaderService) {}

  showLoader() {
    this._loaderService.show();
  }

  hideLoader() {
    this._loaderService.hide();
  }
}
