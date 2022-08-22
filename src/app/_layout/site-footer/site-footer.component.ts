import { Component, OnInit } from '@angular/core';
import { CountingService } from 'src/app/services/counting.service';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css']
})
export class SiteFooterComponent implements OnInit {

  countinData:any = [];
  constructor(private countingService:CountingService) { }

  ngOnInit(): void {
    this.getCounting();
  }

  async getCounting(){
    this.countingService.getCounting().subscribe((res:any) =>{
     this.countinData = res;
    })
  }

}
