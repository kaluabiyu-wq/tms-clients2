import { ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { routes } from "./app.routes";
import { errorInterceptor } from "./Interceptors/error.interceptor";
import { jwtInterceptor } from "./Interceptors/jwt.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([errorInterceptor, jwtInterceptor])
    ),
    provideAnimationsAsync(),
  ],
};