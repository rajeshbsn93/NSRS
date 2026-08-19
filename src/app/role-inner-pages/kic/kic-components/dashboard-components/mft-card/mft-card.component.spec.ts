import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MftCardComponent } from './mft-card.component';

describe('MftCardComponent', () => {
  let component: MftCardComponent;
  let fixture: ComponentFixture<MftCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MftCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MftCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
