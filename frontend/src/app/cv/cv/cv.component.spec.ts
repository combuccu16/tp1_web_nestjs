import { TestBed } from '@angular/core/testing';
import { CvComponent } from './cv.component';

describe('CvComponent — liste, détail, couleurs alternées', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvComponent],
    }).compileComponents();
  });

  it('renders 4 CVs, alternating odd/even and no detail before selection', () => {
    const fixture = TestBed.createComponent(CvComponent);
    fixture.detectChanges();

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
    const fixture = TestBed.createComponent(CvComponent);
    fixture.detectChanges();

    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('app-cv-item');
    expect(items[0].querySelector('img')?.getAttribute('src')).toBe('images/cv1.png');
    expect(items[3].querySelector('img')?.getAttribute('src')).toBe('images/cv.png');
  });

  it('renders the complete CV detail card when a CV is selected', () => {
    const fixture = TestBed.createComponent(CvComponent);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('app-cv-item button').click();
    fixture.detectChanges();

    const card: HTMLElement = fixture.nativeElement.querySelector('app-cv-detail .card');
    expect(card.querySelector('img')?.getAttribute('src')).toBe('images/cv1.png');
    expect(card.querySelector('blockquote')?.textContent?.trim()).toContain('curiosité');
    expect(card.querySelector('h6')?.textContent).toBe('Job Description');
    expect(card.textContent).toContain('Développeur');
    expect(card.textContent).toContain('Âge : 21');
    expect(card.textContent).toContain('CIN : 12345678');
    expect(
      [...card.querySelectorAll('button')].map((button) => button.textContent?.trim()),
    ).toEqual(['Embaucher', 'Détails']);
  });

  it('keeps the state in the parent: click selects, another click moves the selection', () => {
    const fixture = TestBed.createComponent(CvComponent);
    fixture.detectChanges();

    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('app-cv-item');
    items[0].querySelector('button')?.click();
    fixture.detectChanges();

    const title: HTMLElement = fixture.nativeElement.querySelector('app-cv-detail .card-title');
    expect(title.textContent).toContain('Mohamed Amine Ben Fraj');
    expect(items[0].classList.contains('active')).toBe(true);

    items[1].querySelector('button')?.click();
    fixture.detectChanges();

    expect(title.textContent).toContain('Youssef Eladab');
    expect(items[0].classList.contains('active')).toBe(false);
    expect(items[1].classList.contains('active')).toBe(true);
  });
});
