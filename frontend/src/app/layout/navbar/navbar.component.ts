import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_LINKS, UPCOMING_LINKS } from '../nav-links';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  protected readonly links = NAV_LINKS;
  protected readonly upcomingLinks = UPCOMING_LINKS;
  protected readonly languages = ['Français', 'English'];
}
