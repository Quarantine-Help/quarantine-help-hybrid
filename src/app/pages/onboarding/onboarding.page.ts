import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
const HAS_ONBOARDED_STORAGE_KEY = 'hasOnboarded';

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
      delay: 5000,
    },
  };

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit() {}

  onBoardingComplete() {
    this.storageService
      .setObject(
        HAS_ONBOARDED_STORAGE_KEY,
        JSON.stringify({ hasOnboarded: 'true' })
      )
      .then(() => {
        this.router.navigateByUrl('/map');
      });
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  slidesEnd(slides: IonSlides) {
    slides.stopAutoplay();
  }
}