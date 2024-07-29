import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("AuthInterceptor")
  const clonedRequest = req.clone({
    withCredentials: true
  });
  return next(clonedRequest);
};
