import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-athlete-actc-esign-confirmation-dialog',
  templateUrl: './athlete-actc-esign-confirmation-dialog.component.html',
  styleUrls: ['./athlete-actc-esign-confirmation-dialog.component.css'],
  standalone:true,
  imports:[MatDialogModule, MatIconModule]
})
export class AthleteActcEsignConfirmationDialogComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
