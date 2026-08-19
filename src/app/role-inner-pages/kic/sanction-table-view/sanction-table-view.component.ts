import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sanction-table-view',
  templateUrl: './sanction-table-view.component.html',
  styleUrls: ['./sanction-table-view.component.css']
})
export class SanctionTableViewComponent implements OnInit {
  selectedIndex: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
