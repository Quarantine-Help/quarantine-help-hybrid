import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FooterNavPage } from './footer-nav.page';

describe('FooterNavPage', () => {
  let component: FooterNavPage;
  let fixture: ComponentFixture<FooterNavPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterNavPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterNavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
