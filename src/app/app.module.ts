import { NgModule } from '@angular/core';
import { AppRouteModule } from './app-route.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './_common/_helpers/http-interceptor.service';
import { AuthInterceptor } from './_common/_helpers/auth-interceptor';
import { FormsModule } from '@angular/forms';
import { FilePathReplaceInterceptor } from './_common/_helpers/file-path-replace.interceptor';
import { FilePathExcludeInterceptor } from './_common/_helpers/file-path-exclude.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AppRouteModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FilePathReplaceInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FilePathExcludeInterceptor, multi: true },
    DatePipe
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
