import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { NAV_LINKS, UPCOMING_LINKS } from '../nav-links';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected readonly links = NAV_LINKS;
  protected readonly upcomingLinks = UPCOMING_LINKS;
  protected readonly languages = ['Français', 'English'];
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  protected logout(): void {
    this.authService.logout();
    this.toastService.show('Vous êtes déconnecté.', 'success');
    void this.router.navigate(['/']);
  }
}
