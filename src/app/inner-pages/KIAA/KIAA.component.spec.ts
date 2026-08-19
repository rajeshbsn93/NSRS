/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { KIAAComponent } from './KIAA.component';

describe('KIAAComponent', () => {
  let component: KIAAComponent;
  let fixture: ComponentFixture<KIAAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KIAAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KIAAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
