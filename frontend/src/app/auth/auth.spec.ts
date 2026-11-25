import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../config/api.config';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService, TOKEN_STORAGE_KEY } from './services/auth.service';

describe('Authentification : service, guards, intercepteur', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  async function login(): Promise<AuthService> {
    const authService = TestBed.inject(AuthService);
    const done = firstValueFrom(authService.login({ email: 'a@b.tn', password: 'secret' }));
    httpMock.expectOne(API_ENDPOINTS.login).flush({ id: 'TOKEN-123', ttl: 1, created: '', userId: 1 });
    await done;
    return authService;
  }

  it('stores the token in the localStorage on login and clears it on logout', async () => {
    const authService = await login();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe('TOKEN-123');
    expect(authService.isAuthenticated()).toBe(true);

    authService.logout();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('interceptor: adds the token to API requests only when logged in', async () => {
    http.get(API_ENDPOINTS.personnes).subscribe();
    expect(httpMock.expectOne(API_ENDPOINTS.personnes).request.headers.has('Authorization')).toBe(
      false,
    );

    await login();
    http.delete(`${API_ENDPOINTS.personnes}/1`).subscribe();
    const req = httpMock.expectOne(`${API_ENDPOINTS.personnes}/1`);
    expect(req.request.headers.get('Authorization')).toBe('TOKEN-123');
    req.flush(null);

    http.get('https://example.com/other').subscribe();
    expect(httpMock.expectOne('https://example.com/other').request.headers.has('Authorization')).toBe(
      false,
    );
  });

  it('interceptor: logs out when the API answers 401', async () => {
    const authService = await login();
    http.delete(`${API_ENDPOINTS.personnes}/1`).subscribe({ error: () => undefined });
    httpMock
      .expectOne(`${API_ENDPOINTS.personnes}/1`)
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(authService.isAuthenticated()).toBe(false);
  });

  it('authGuard: redirects anonymous users to /login with the returnUrl', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, { url: '/cv/3' } as never),
    );
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fcv%2F3');
  });

  it('guestGuard: a logged-in user cannot open the login page', async () => {
    expect(TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never))).toBe(true);

    await login();
    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/cv');
  });
});
