import { Component, OnInit } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  slideOptions = {
    initialSlide: 0,
    speed: 400,
  };

  constructor() {}

  ngOnInit() {}

  onBoardingComplete() {
    console.log('onBoardingComplete');
  }

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }
}
