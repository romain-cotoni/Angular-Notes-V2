import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("\n----HttpInterceptor----")
  const clonedRequest = req.clone({
    withCredentials: true
  });
  return next(clonedRequest);
};
