import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiscePropsalsComponent } from './kisce-propsals.component';

describe('KiscePropsalsComponent', () => {
  let component: KiscePropsalsComponent;
  let fixture: ComponentFixture<KiscePropsalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiscePropsalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KiscePropsalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
