import { Component, OnInit } from '@angular/core';
import { RouterEvent, Router } from '@angular/router';

type Language = 'en' | 'de';
@Component({
  selector: 'app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss'],
})
export class AppMenuComponent implements OnInit {
  pages: { name: string; icon: string; path: string }[];
  activePath: string;
  language: Language;
  languages: { name: string; value: Language }[];
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url) {
        this.activePath = event.url;
      }
    });
    this.languages = [
      { name: 'English', value: 'en' },
      { name: 'Deutsch', value: 'de' },
    ];
    this.language = 'en';
    this.pages = [
      {
        name: 'Home',
        icon: 'home',
        path: '/map',
      },
      {
        name: 'Search',
        icon: 'search',
        path: '/map/:search',
      },
      {
        name: 'Requests',
        icon: 'help-buoy-outline',
        path: '/view-requests',
      },
      {
        name: 'My Profile',
        icon: 'person',
        path: '/profile',
      },
      {
        name: 'Logout',
        icon: 'exit',
        path: '/exit',
      },
    ];
  }

  ngOnInit() {}
}
