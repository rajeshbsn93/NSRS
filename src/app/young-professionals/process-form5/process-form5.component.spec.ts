import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessForm5Component } from './process-form5.component';

describe('ProcessForm5Component', () => {
  let component: ProcessForm5Component;
  let fixture: ComponentFixture<ProcessForm5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessForm5Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessForm5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
