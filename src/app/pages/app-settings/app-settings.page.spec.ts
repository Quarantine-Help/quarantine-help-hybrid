import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppSettingsPage } from './app-settings.page';

describe('AppSettingsPage', () => {
  let component: AppSettingsPage;
  let fixture: ComponentFixture<AppSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppSettingsPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
