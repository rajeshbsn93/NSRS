import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YpRejectComponent } from './yp-reject.component';

describe('YpRejectComponent', () => {
  let component: YpRejectComponent;
  let fixture: ComponentFixture<YpRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YpRejectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YpRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
