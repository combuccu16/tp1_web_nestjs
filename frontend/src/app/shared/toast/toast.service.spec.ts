import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('shows and dismisses toasts', () => {
    service.show('Budget dépassé', 'danger');
    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].message).toBe('Budget dépassé');

    service.dismiss(service.toasts()[0].id);
    expect(service.toasts()).toHaveLength(0);
  });
});
