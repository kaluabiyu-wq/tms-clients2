import { ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { routes } from "./app.routes";
import { credentialInterceptor } from "./Interceptors/credintials.interceptor";
 
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([credentialInterceptor]),
      withXsrfConfiguration(
        {
          cookieName: 'XSRF-TOKEN',
          headerName: 'X-SRF-TOKEN',
        }
      )
    ),
     provideAnimationsAsync(),
  ],
};