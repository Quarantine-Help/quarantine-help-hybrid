import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateRequestPage } from './create-request.page';

describe('CreateRequestPage', () => {
  let component: CreateRequestPage;
  let fixture: ComponentFixture<CreateRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
