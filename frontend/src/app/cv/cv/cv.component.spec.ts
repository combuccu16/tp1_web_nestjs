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

  it('keeps the state in the parent: click selects, another click moves the selection', () => {
    const fixture = TestBed.createComponent(CvComponent);
    fixture.detectChanges();

    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('app-cv-item');
    items[0].querySelector('button')?.click();
    fixture.detectChanges();

    const title: HTMLElement = fixture.nativeElement.querySelector('app-cv-detail .card-title');
    expect(title.textContent).toContain('Muhyiddin Ben Fraj');
    expect(items[0].classList.contains('active')).toBe(true);

    items[1].querySelector('button')?.click();
    fixture.detectChanges();

    expect(title.textContent).toContain('Aymen Sellaouti');
    expect(items[0].classList.contains('active')).toBe(false);
    expect(items[1].classList.contains('active')).toBe(true);
  });
});
