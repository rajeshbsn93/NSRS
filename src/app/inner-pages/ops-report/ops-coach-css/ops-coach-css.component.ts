import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-ops-coach-css',
  templateUrl: './ops-coach-css.component.html',
  styleUrls: ['./ops-coach-css.component.css']
})
export class OpsCoachCssComponent implements OnInit {

   @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;
    displayedColumns:any=[]
    dataSource:any=[]
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
      console.log(this.dataSource?.data)
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
