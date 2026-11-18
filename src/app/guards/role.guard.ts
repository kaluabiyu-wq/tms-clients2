import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

export const roleGuard = (requiredRole: string | string[]): CanActivateFn => {
    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);

        if (Array.isArray(requiredRole) ? auth.hasAnyRole(requiredRole) : auth.hasRole(requiredRole)) {
            return true;
        }

        return router.createUrlTree(["/unauthorized"]);
    };
};