import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyExistCheckComponent } from './already-exist-check.component';

describe('AlreadyExistCheckComponent', () => {
  let component: AlreadyExistCheckComponent;
  let fixture: ComponentFixture<AlreadyExistCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlreadyExistCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadyExistCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
