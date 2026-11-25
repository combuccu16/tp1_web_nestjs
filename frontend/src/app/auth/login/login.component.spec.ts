import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent — validation du formulaire', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const emailInput = el.querySelector<HTMLInputElement>('#login-email')!;
    const passwordInput = el.querySelector<HTMLInputElement>('#login-password')!;
    const submit = el.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    const type = (input: HTMLInputElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    const blur = (input: HTMLInputElement) => {
      input.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
    };
    return { fixture, el, emailInput, passwordInput, submit, type, blur };
  }

  it('starts with a disabled button and no red border', () => {
    const { emailInput, passwordInput, submit } = setup();
    expect(submit.disabled).toBe(true);
    expect(emailInput.classList.contains('is-invalid')).toBe(false);
    expect(passwordInput.classList.contains('is-invalid')).toBe(false);
  });

  it('a touched empty field gets a red border and an error message', () => {
    const { el, emailInput, blur } = setup();
    blur(emailInput);
    expect(emailInput.classList.contains('is-invalid')).toBe(true);
    expect(el.querySelector('#login-email-error')?.textContent).toContain("L'email est obligatoire.");
  });

  it('rejects an invalid email, a blacklisted email and a short password', () => {
    const { el, emailInput, passwordInput, type } = setup();

    type(emailInput, 'not-an-email');
    expect(el.querySelector('#login-email-error')?.textContent).toContain("n'est pas valide");

    type(emailInput, 'spam@cvtech.tn');
    expect(el.querySelector('#login-email-error')?.textContent).toContain('interdite');

    type(passwordInput, 'abc');
    expect(passwordInput.classList.contains('is-invalid')).toBe(true);
    expect(el.querySelector('#login-password-error')?.textContent).toContain('au moins 4');
  });

  it('enables the button only when the form is valid', () => {
    const { emailInput, passwordInput, submit, type } = setup();
    type(emailInput, 'aymen@gmail.com');
    type(passwordInput, 'abcd');
    expect(submit.disabled).toBe(false);
  });
});
