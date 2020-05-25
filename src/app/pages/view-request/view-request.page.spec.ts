import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewRequestPage } from './view-request.page';

describe('RequestPage', () => {
  let component: ViewRequestPage;
  let fixture: ComponentFixture<ViewRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
