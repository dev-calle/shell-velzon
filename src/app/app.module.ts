import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { AuthLayoutModule } from './layouts/auth-layout/auth-layout.module';
import { SegurityLayoutModule } from './layouts/segurity-layout/segurity-layout.module';

import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';

// Language
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { InterceptorService } from './services/interceptor.service';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.state';
import { InterceptorError } from './services/interceptor-error.service';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    ErrorPageComponent,
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
    StoreModule.forRoot( appReducer )
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorError,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
