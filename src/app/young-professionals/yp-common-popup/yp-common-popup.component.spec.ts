import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YpCommonPopupComponent } from './yp-common-popup.component';

describe('YpCommonPopupComponent', () => {
  let component: YpCommonPopupComponent;
  let fixture: ComponentFixture<YpCommonPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YpCommonPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YpCommonPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
