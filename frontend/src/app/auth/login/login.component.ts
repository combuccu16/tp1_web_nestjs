import { Component, inject, input, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../shared/toast/toast.service';
import { AuthService, Credentials } from '../services/auth.service';
import { blacklistedEmail } from '../validators/blacklisted-email.validator';

export const PASSWORD_MIN_LENGTH = 4;

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly returnUrl = input<string>();

  private readonly credentials = signal<Credentials>({ email: '', password: '' });
  protected readonly loginError = signal<string | null>(null);
  protected readonly sending = signal(false);

  protected readonly loginForm = form(
    this.credentials,
    (path) => {
      required(path.email, { message: "L'email est obligatoire." });
      email(path.email, { message: "L'email n'est pas valide." });
      blacklistedEmail(path.email);
      required(path.password, { message: 'Le mot de passe est obligatoire.' });
      minLength(path.password, PASSWORD_MIN_LENGTH, {
        message: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères.`,
      });
    },
    { submission: { action: async () => this.login() } },
  );

  private async login(): Promise<void> {
    this.loginError.set(null);
    this.sending.set(true);
    try {
      await firstValueFrom(this.authService.login(this.credentials()));
      this.toastService.show('Connexion réussie.', 'success');
      await this.router.navigateByUrl(this.returnUrl() || '/cv');
    } catch {
      this.loginError.set('Email ou mot de passe incorrect.');
    } finally {
      this.sending.set(false);
    }
  }
}
