import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YpApprovedComponent } from './yp-approved.component';

describe('YpApprovedComponent', () => {
  let component: YpApprovedComponent;
  let fixture: ComponentFixture<YpApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YpApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YpApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
