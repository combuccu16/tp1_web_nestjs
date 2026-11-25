import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_ENDPOINTS } from '../../config/api.config';
import { CvComponent } from './cv.component';

describe('CvComponent — liste, détail, couleurs alternées', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  function createWithFakeCvs() {
    const fixture = TestBed.createComponent(CvComponent);
    fixture.detectChanges();
    httpMock.expectOne(API_ENDPOINTS.personnes).flush(null, { status: 500, statusText: 'Error' });
    fixture.detectChanges();
    return fixture;
  }

  it('renders the 4 FakeCvs when the API fails, alternating odd/even, no detail yet', () => {
    const fixture = createWithFakeCvs();

    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('app-cv-item');
    expect(items).toHaveLength(4);
    expect([...items].map((item) => item.classList.contains('odd'))).toEqual([
      false,
      true,
      false,
      true,
    ]);
    expect(fixture.nativeElement.querySelector('app-cv-detail .card')).toBeNull();
  });

  it('uses the default image when a CV has no path', () => {
    const fixture = createWithFakeCvs();

    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('app-cv-item');
    expect(items[0].querySelector('img')?.getAttribute('src')).toBe('images/cv1.png');
    expect(items[3].querySelector('img')?.getAttribute('src')).toBe('images/cv.png');
  });

  it('renders the CV detail card with a link to the details page', () => {
    const fixture = createWithFakeCvs();

    fixture.nativeElement.querySelector('app-cv-item button').click();
    fixture.detectChanges();

    const card: HTMLElement = fixture.nativeElement.querySelector('app-cv-detail .card');
    expect(card.querySelector('h6')?.textContent).toBe('Job Description');
    expect(card.textContent).toContain('Âge : 21');
    expect(card.textContent).toContain('CIN : 12345678');
    expect(card.querySelector('button')?.textContent?.trim()).toBe('Embaucher');
    expect(card.querySelector('a')?.getAttribute('href')).toBe('/cv/1');
  });

  it('keeps the state in the parent: click selects, another click moves the selection', () => {
    const fixture = createWithFakeCvs();

    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('app-cv-item');
    items[0].querySelector('button')?.click();
    fixture.detectChanges();

    const title: HTMLElement = fixture.nativeElement.querySelector('app-cv-detail .card-title');
    expect(title.textContent).toContain('Mohamed Amine Ben Fraj');

    items[1].querySelector('button')?.click();
    fixture.detectChanges();

    expect(title.textContent).toContain('Youssef Eladab');
    expect(items[1].classList.contains('active')).toBe(true);
  });
});
