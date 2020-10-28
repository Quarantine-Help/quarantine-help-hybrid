import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectUserTypePage } from './select-user-type.page';

describe('SelectUserTypePage', () => {
  let component: SelectUserTypePage;
  let fixture: ComponentFixture<SelectUserTypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectUserTypePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectUserTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
