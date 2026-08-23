import { HttpInterceptorFn } from "@angular/common/http";
import { Inject } from "@angular/core";
import { AuthService } from "../services/auth.service";


export const jwtInterceptor : HttpInterceptorFn = (req, next) => 
{
    const auth  = Inject(AuthService);
    const token = auth.getAccessToken();

    if(token)
    {
        const cloned = req.clone(
            {
        setHeaders: {Autherization: `Bearer ${token}`}
            }
        );
        return next(cloned);
    }
    return next(req);
}