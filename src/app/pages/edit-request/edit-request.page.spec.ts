import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditRequestPage } from './edit-request.page';

describe('EditRequestPage', () => {
  let component: EditRequestPage;
  let fixture: ComponentFixture<EditRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditRequestPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
