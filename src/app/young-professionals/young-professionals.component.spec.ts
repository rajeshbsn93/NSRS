import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoungProfessionalsComponent } from './young-professionals.component';

describe('YoungProfessionalsComponent', () => {
  let component: YoungProfessionalsComponent;
  let fixture: ComponentFixture<YoungProfessionalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoungProfessionalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoungProfessionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
