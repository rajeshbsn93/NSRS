import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KicAcademyComponent } from './kic-academy.component';

describe('KicAcademyComponent', () => {
  let component: KicAcademyComponent;
  let fixture: ComponentFixture<KicAcademyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KicAcademyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KicAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
