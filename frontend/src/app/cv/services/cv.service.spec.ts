import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';
import { ToastService } from '../../shared/toast/toast.service';
import { API_ERROR_MESSAGE, CvService, FAKE_CVS } from './cv.service';

describe('CvService (API + repli sur les FakeCvs)', () => {
  let service: CvService;
  let httpMock: HttpTestingController;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CvService);
    httpMock = TestBed.inject(HttpTestingController);
    toastService = TestBed.inject(ToastService);
  });

  afterEach(() => httpMock.verify());

  it('maps the API CVs (cin as string, unknown image paths dropped)', async () => {
    const cvs = firstValueFrom(service.getCvs());
    httpMock.expectOne(API_ENDPOINTS.personnes).flush([
      { id: 7, name: 'Bailly', firstname: 'Stephan', age: 20, cin: 12345699, job: 'Dev', path: '' },
      { id: 8, name: 'X', firstname: 'Y', age: 30, cin: 1, job: 'Dev', path: 'tim_logo.png' },
    ]);

    const result = await cvs;
    expect(result.map((cv) => cv.id)).toEqual([7, 8]);
    expect(result[0].cin).toBe('12345699');
    expect(result[1].path).toBe('');
    expect(toastService.toasts()).toHaveLength(0);
  });

  it('falls back to the FakeCvs and shows an error toast when the API fails', async () => {
    const cvs = firstValueFrom(service.getCvs());
    httpMock.expectOne(API_ENDPOINTS.personnes).flush(null, { status: 500, statusText: 'Error' });

    expect(await cvs).toEqual([...FAKE_CVS]);
    expect(toastService.toasts()[0]).toMatchObject({ message: API_ERROR_MESSAGE, type: 'danger' });
  });

  it('falls back to the matching FakeCv for the details too', async () => {
    const cv = firstValueFrom(service.getCvById(2));
    httpMock.expectOne(`${API_ENDPOINTS.personnes}/2`).flush(null, { status: 404, statusText: 'Not Found' });

    expect((await cv)?.firstname).toBe('Youssef');
    expect(toastService.toasts()).toHaveLength(1);
  });

  it('deletes a CV with an HTTP DELETE', () => {
    service.deleteCv(1334).subscribe();
    const req = httpMock.expectOne(`${API_ENDPOINTS.personnes}/1334`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
