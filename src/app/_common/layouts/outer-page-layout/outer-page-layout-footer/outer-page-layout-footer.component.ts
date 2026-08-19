import { Component, OnInit } from '@angular/core';
import { SharableService } from 'src/app/_common/services/innerPagesServices/innerpagesSharable.service';

@Component({
  selector: 'app-outer-page-layout-footer',
  templateUrl: './outer-page-layout-footer.component.html',
  styleUrls: ['./outer-page-layout-footer.component.css']
})
export class OuterPageLayoutFooterComponent implements OnInit {
  loaderMain:boolean = true;
  countingData:any = [];
  constructor(private sharableService:SharableService) { }

  ngOnInit(): void {
    this.getCounting();
  }

  getCounting(){
    this.sharableService.getCounting().subscribe({
      next:(res:any) =>{
        this.loaderMain = false
       this.countingData = res;
      },
      error:()=>{
        console.error("error caught in counting footer")
        this.loaderMain=false
      }
    })
  }
}
