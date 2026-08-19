import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YpPendingComponent } from './yp-pending.component';

describe('YpPendingComponent', () => {
  let component: YpPendingComponent;
  let fixture: ComponentFixture<YpPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YpPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YpPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
