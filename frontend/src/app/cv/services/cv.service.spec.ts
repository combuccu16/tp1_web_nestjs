import { TestBed } from '@angular/core/testing';
import { CvService } from './cv.service';

describe('CvService', () => {
  let service: CvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvService);
  });

  it('returns the shared CV list and finds CVs by id', () => {
    expect(service.getCvs()).toHaveLength(4);
    expect(service.getCvById(2)?.firstname).toBe('Youssef');
    expect(service.getCvById(999)).toBeUndefined();
  });

  it('returns a copy of the list so callers cannot mutate it', () => {
    const cvs = service.getCvs();
    cvs.pop();

    expect(service.getCvs()).toHaveLength(4);
  });
});
