import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http'

import { AppComponent } from './app.component';
import { NotFoundComponent } from './helpers/not-found/not-found.component';
import { ErrorComponent } from './helpers/error/error.component';
import { AppRoutingModule } from './app.routing.module';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AuthLayoutModule } from './layouts/auth-layout/auth-layout.module';
import { SegurityLayoutModule } from './layouts/segurity-layout/segurity-layout.module';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ErrorComponent,
  ],
  imports: [

    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthLayoutModule,
    SegurityLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
