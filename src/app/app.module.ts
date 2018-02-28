import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from 'app/directives/webview.directive';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MymoduleModule} from './mymodule/mymodule.module';
import {HomeModule} from './components/home/home.module';
import {ImageUploadModule} from 'angular2-image-upload';
import {ProfileService} from './components/home/page/profile/services/profile.service';

import { DateFormat } from './utils/date-formats';
import { DateAdapter } from '@angular/material';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),

    MymoduleModule,
    HomeModule,
    ImageUploadModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ElectronService, ProfileService,  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 
 }
