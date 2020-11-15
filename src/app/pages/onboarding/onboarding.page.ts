import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage/storage.service';
import { StorageKeys } from 'src/app/constants/core-api';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  slideOptions = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 8000,
    },
  };

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit() {}

  onBoardingComplete() {
    this.storageService
      .setObject(
        StorageKeys.hasUserOnboarded,
        JSON.stringify({ hasUserOnboarded: true })
      )
      .then(() => {
          this.router.navigateByUrl('/select-user-type');
      });
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  slidesEnd(slides: IonSlides) {
    slides.stopAutoplay();
  }
}
