import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ops-athlete-css',
  templateUrl: './ops-athlete-css.component.html',
  styleUrls: ['./ops-athlete-css.component.css']
})
export class OpsAthleteCssComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns:any=[]
  dataSource:any=[]
  isLastPage=false
  totalAthletes: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  displayCol(e:any){
    this.displayedColumns=e
  }

  getTableData(data:any){
      this.dataSource=data
      this.paginator.pageIndex = 0; // Reset to first page
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.calculateTotalAthletes();
  }

  calculateTotalAthletes(): void {
    this.totalAthletes = this.dataSource?.data
      .map((element: any) => element['TOTAL ATHLETE'])
      .reduce((acc: number, value: number) => acc + value, 0);
  }
  
   onPageChange(event: any): void {
    this.calculateTotalAthletes();
  }

  onSortChange(): void {
    this.calculateTotalAthletes();
  }

}
