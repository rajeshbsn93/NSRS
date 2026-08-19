import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sanction-uc-table-view',
  templateUrl: './sanction-uc-table-view.component.html',
  styleUrls: ['./sanction-uc-table-view.component.css']
})
export class SanctionUcTableViewComponent implements OnInit {
  selectedIndex: number = 0;
  constructor() { }

  ngOnInit(): void {
     console.log('');
  }

}
