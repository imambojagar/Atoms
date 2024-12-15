import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError, timer } from 'rxjs';
import { switchMap, catchError, finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { EmployeeService } from './services/employee.service';
// Static variable to keep track of token refreshing state
let isRefreshingToken = false;

// Functional interceptor
export const AppHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const empSrvc = inject(EmployeeService);
  const messageService = inject(MessageService);
  const authService = inject(AuthService);

  const token = localStorage.getItem('token') || '';
  const assetGroup =
    JSON.parse(localStorage.getItem('selectedAssetGroup') || '{}')?.id?.toString() || '';

  // Clone request with headers if 'skip' header is not present
  const clonedReq = req.headers.has('skip')
    ? req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    })
    : addAuthorizationHeader(req, token, assetGroup);

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => handleError(error, clonedReq, next, empSrvc, messageService, authService)),
    finalize(() => {
      // Any cleanup logic if needed
    })
  );
};

// Helper function to add authorization and asset group headers
const addAuthorizationHeader = (req: HttpRequest<any>, token: string, assetGroup: string): HttpRequest<any> => {
  return req.clone({
    headers: new HttpHeaders({
      Authorization: `Bearer ${token}`,
      AssetGroup: assetGroup,
    }),
  });
};

// Helper function to handle errors
const handleError = (
  error: HttpErrorResponse,
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  empSrvc: EmployeeService,
  messageService: MessageService,
  authService: AuthService
): Observable<HttpEvent<any>> => {
  if (error.status === 401) {
    return handleUnauthorizedError(req, next, empSrvc, messageService, authService);
  }

  // Handle other errors (e.g., show a toast message)
  messageService.add({
    severity: 'warn',
    summary: 'Request Cancelled',
    detail: error.message || 'Request was cancelled.',
  });

  return throwError(() => error);
};

// Helper function to handle 401 Unauthorized errors
const handleUnauthorizedError = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  empSrvc: EmployeeService,
  messageService: MessageService,
  authService: AuthService
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (isRefreshingToken) {
    // If already refreshing, wait and retry the request
    return timer(5000).pipe(
      switchMap(() => next(addAuthorizationHeader(req, token || '', '')))
    );
  }

  isRefreshingToken = true;

  if (!token || !refreshToken) {
    authService.logout();
    return throwError(() => new Error('User is not authenticated'));
  }

  return from(empSrvc.getRefreshedToken(token, refreshToken)).pipe(
    switchMap((res: any) => {
      if (res.token) {
        // Save new tokens
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);

        isRefreshingToken = false;

        // Retry the original request
        return next(addAuthorizationHeader(req, res.token, ''));
      } else {
        // Logout if token refresh fails
        isRefreshingToken = false;
        authService.logout();
        return throwError(() => new Error('Token refresh failed'));
      }
    }),
    catchError(() => {
      isRefreshingToken = false;
      authService.logout();
      return throwError(() => new Error('Token refresh failed'));
    })
  );
};
