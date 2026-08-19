/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OuterPageLayoutHeaderComponent } from './outer-page-layout-header.component';

describe('OuterPageLayoutHeaderComponent', () => {
  let component: OuterPageLayoutHeaderComponent;
  let fixture: ComponentFixture<OuterPageLayoutHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OuterPageLayoutHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OuterPageLayoutHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
