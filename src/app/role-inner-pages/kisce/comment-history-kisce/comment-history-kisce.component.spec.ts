import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentHistoryKisceComponent } from './comment-history-kisce.component';

describe('CommentHistoryKisceComponent', () => {
  let component: CommentHistoryKisceComponent;
  let fixture: ComponentFixture<CommentHistoryKisceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentHistoryKisceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentHistoryKisceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
