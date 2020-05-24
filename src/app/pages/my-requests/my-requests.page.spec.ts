import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyRequestsPage } from './my-requests.page';

describe('MyRequestsPage', () => {
  let component: MyRequestsPage;
  let fixture: ComponentFixture<MyRequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRequestsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
