/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UsermanualstcusermanualComponent } from './usermanualstcusermanual.component';

describe('UsermanualstcusermanualComponent', () => {
  let component: UsermanualstcusermanualComponent;
  let fixture: ComponentFixture<UsermanualstcusermanualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsermanualstcusermanualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsermanualstcusermanualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
