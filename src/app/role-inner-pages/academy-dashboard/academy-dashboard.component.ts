import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AddressDetailsComponent } from '../modal-window/address-details/address-details.component';
import { BasicDetailsComponent } from '../modal-window/basic-details/basic-details.component';
import { SportsDisciplineComponent } from '../modal-window/sports-discipline/sports-discipline.component';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { AcademySharableService } from 'src/app/_common/services/role-inner-pages-services/academy-services/academySharable.service';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';
import { Observable, map } from 'rxjs';
HC_exporting(Highcharts);
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-academy-dashboard',
  templateUrl: './academy-dashboard.component.html',
  styleUrls: ['./academy-dashboard.component.css']
})
export class AcademyDashboardComponent implements OnInit {
basicInfoModalRef:any;
addressRef:any
SportDisciplineRef:any;
Highcharts: typeof Highcharts = Highcharts;
userDetails:any;
academyDashboardData$:Observable<any> = new Observable();
chartOptionsAthleteCoach:any;
athleteCoachDiscipline:Array<any> = [];
athleteMaleVacant:Array<any> = [];
athleteMale:Array<any> = [];
athleteFemaleVacant:Array<any> = [];
athleteFemale:Array<any> = [];
coachMaleVacant:Array<any> = [];
coachMale:Array<any> = [];
coachFemaleVacant:Array<any> = [];
coachFemale:Array<any> = [];
chartOptionsSportScience:any;
sportScientistMaleVacant:Array<any> = []
sportScientistMale:Array<any> = []
sportScientistFemaleVacant:Array<any> = []
sportScientistFemale:Array<any> = []
chartOptionsFinancialStatus:any;
scholarshipData:Array<any> = [];
chartOptionsInsurance:any
insuranceNotInsured:Array<any> = []
insuranceExpired:Array<any> = []
insurancePending:Array<any> = []
insuranceInsured:Array<any> = []
achievementData:Array<any> = [];
totalCountGrid:any;

  constructor(
    private modalService: NgbModal,
    private academySharableService:AcademySharableService,
    private storageService:StorageService
    ) { }

  ngOnInit() {
    this.userDetails = this.storageService.getUserDetails();
    this.getAcademyDashboard();
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    nav: true,
    margin: 15,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-angle-left"></i>', '<i class="fa-solid fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },    
  }

  
  

  getAcademyDashboard(){
    this.academyDashboardData$ = this.academySharableService.getAcademyDashboard(this.userDetails.user_id).pipe(
      map((res:any)=>{
        // res.data.scholarship.filter((data:any)=>{
        //   this.scholarshipType.push(data.scholarship_type)
        //   this.scholarshipData.push(data.percentage_count)
        // })
        this.achievementData = res?.data?.achievement;
        this.totalCountGrid = res?.data?.academyHeader;
        this.sportScientistChart(res?.data?.sports_scientist_profile)
        this.financialStatusChart(res?.data?.scholarship)
        this.athleteCoachChart(res.data.althelte_profile)
        this.insuranceStatusChart(res.data.insurance_status)
        return res
      })
    )   
  }
  athleteCoachChart(athleteData:any){
    // console.log('athleteData',athleteData)
    this.athleteCoachDiscipline = []
    this.athleteMaleVacant = [];
    this.athleteMale = [];
    this.athleteFemaleVacant = [];
    this.athleteFemale = [];
    this.coachMaleVacant = [];
    this.coachMale = [];
    this.coachFemaleVacant = [];
    this.coachFemale = [];
    athleteData.filter((item:any)=>{
      this.athleteCoachDiscipline.push(item.sport_display_name)
      this.athleteMaleVacant.push(item.vacent_MaleAthlete)
      this.athleteMale.push(item.male_Athlete)
      this.athleteFemaleVacant.push(item.vacent_FeMaleAthlete)
      this.athleteFemale.push(item.feMale_Athlete)
      this.coachMaleVacant.push(item.vacentmaleCoach)
      this.coachMale.push(item.male_coach)
      this.coachFemaleVacant.push(item.vacentfemaleCoach)
      this.coachFemale.push(item.female_coach)
    })


    this.chartOptionsAthleteCoach= {
      colors:['#DEDEDE',
              '#FE853C',
              '#DEDEDE',
              '#1F60AB',
              '#DEDEDE',
              '#088292',
              '#DEDEDE', 
              '#B044E5'],
      chart: {
        type: 'column',
        marginTop: 50,
        style: {
          fontFamily: 'Lato'
        },
        animation: true,
      },
      
      title: {
        text: null
      },
      xAxis: {
        // categories: ['ARCHERY', 'WRESTLING', 'ATHLETICS','HOCKEY']
        categories: this.athleteCoachDiscipline
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        }
      },
      legend: {
        // layout: 'vertical',
        align: 'center',
        verticalAlign: 'top',
        // x: -40,
        y: -10,
        floating: true,
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        //     Highcharts?.defaultOptions?.legend.backgroundColor || '#FFFFFF',
        shadow: true,
        enabled: true
      },
      credits: {
        enabled: false
      },
      exporting: {
          enabled: true
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              pointPadding: 0.3,
          },
      },
      series: [
        {      
        name: 'ATHLETE-MALE VACANT',
        // data: [50,50,50,50],
        data: this.athleteMaleVacant,
        // color:'red'
        stack:0,
        showInLegend: false,
      }, {
        name: 'ATHLETE-MALE',
        // data: [350,300,200,150],
        data: this.athleteMale,
        stack:0
      },
      {
        showInLegend: false,
        name: 'ATHLETE-FEMALE VACANT',
        // data: [50,50,50,50],
        data: this.athleteFemaleVacant,
        // color:'red'
        stack:1,
      }, {
        name: 'ATHLETE-FEMALE',
        // data: [500,250,600,400],
        data: this.athleteFemale,
        stack:1
      }, 
      {
        showInLegend: false,
        name: 'COACH-MALE VACANT',
        // data: [50,50,50,50],
        data: this.coachMaleVacant,
        // color:'red'
        stack:2,
      },
      {
        name: 'COACH-MALE',
        // data: [400,350,300,100],
        data: this.coachMale,
        stack:2
      },
      {
        showInLegend: false,
        name: 'COACH-FEMALE VACANT',
        // data: [50, 50, 50, 50],
        data: this.coachFemaleVacant,
        stack:3
      },
      {
        name: 'COACH-FEMALE',
        // data: [250, 300, 450, 350],
        data:this.coachFemale,
        stack:3
        // data: this.barChartAbsenttestData
      },
    ]
    };
  }
  sportScientistChart(data:any){
    // console.log('sport scientist',data)
    this.sportScientistMaleVacant = [],
    this.sportScientistMale = [];
    this.sportScientistFemaleVacant = [];
    this.sportScientistFemale = [];
    let sportScientistCategory:Array<any> = []
    data.filter((item:any)=>{
      this.sportScientistMaleVacant.push(item.vacentMaleSportsScientist)
      this.sportScientistMale.push(item.male_sports_scientist)
      this.sportScientistFemaleVacant.push(item.vacentFemaleMaleSportsScientist)
      this.sportScientistFemale.push(item.femaleSportsScientist)
      sportScientistCategory.push(item.name)
    })
    this.chartOptionsSportScience ={
      colors:['#DEDEDE',
              '#FE853C',
              '#DEDEDE',
              '#1F60AB',],
      chart: {
        type: 'column',
        marginTop: 60,
        style: {
          fontFamily: 'Lato'
        },
        animation: true,
      },
      
      title: {
        text: null
      },
      xAxis: {
        // categories: ['BIOCHEMISTRY', 'ANTHROPOMETRY', 'BIOMECHANICS','PHYSIOLOGY','BIOMECHANICS','PSYCHOLOGY']
        categories: sportScientistCategory
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        }
      },
      legend: {
        // layout: 'vertical',
        align: 'center',
        verticalAlign: 'top',
        // x: -40,
        // y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:'#FFFFFF',
        //     Highcharts?.defaultOptions?.legend.backgroundColor || '#FFFFFF',
        shadow: true
        // enabled: false
      },
      credits: {
        enabled: false
      },
      exporting: {
          enabled: false
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              pointPadding: 0.3,
          },
      },
      series: [
        {      
        name: 'MALE VACANT',
        // data: [50,50,50,50,50,50],
        data: this.sportScientistMaleVacant,
        stack:0,
        showInLegend: false,
      },
      {
        name: 'MALE',
        // data: [350,300,200,100,400,350],
        data: this.sportScientistMale,
        stack:0
      },
      {
        showInLegend: false,
        name: 'FEMALE VACANT',
        // data: [50,50,50,50,50,50],
        data: this.sportScientistFemaleVacant,
        stack:1,
      },
      {
        name: 'FEMALE',
        // data: [500, 300, 300, 350,400,300],
        data: this.sportScientistFemale,
        stack:1
        // data: this.barChartAbsenttestData
      },
    ]
    };
  }
  financialStatusChart(data:any){
    this.scholarshipData = []
    data.filter((item:any)=>{
      const filterItem = {
        name:item.scholarship_type,
        y:item.percentage_count
      }
      this.scholarshipData.push(filterItem)
    })
    // console.log('FINANCIAL ASSISTANCE STATUS',this.scholarshipData)
    this.chartOptionsFinancialStatus ={
      chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          fontFamily:'Lato'
      },
      colors:['#1F60AB','','#FE853C','#42B808'],
        title: {
            text: null,
            align: 'left'
        },
          legend: {
            enabled: true,
            align: 'center',
            // verticalAlign: 'top',
        },
  
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
      },
      accessibility: {
          point: {
              valueSuffix: '%'
          }
      },
      credits: {
        enabled: false
      },
      exporting: {
          enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              colorByPoint: true,
              type: 'pie',
              size: '100%',
              innerSize: '50%',
              dataLabels: {
                  enabled: false,
                  // crop: false,
                  // distance: '-25%',
                  style: {
                      fontWeight: 'bold',
                      fontSize: '13px',
                      fontFamily:'Lato',
                      textShadow: false,
                      textOutline: false,
                  },
                  // connectorWidth: 0
              }
          },
          pie:{
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true
          }
      },
      series: [{
          name: 'FINANCIAL',
          colorByPoint: true,
          data:this.scholarshipData
          // data: [
          //   {
          //       name: 'KHELO INDIA',
          //       y: 45,
          //   }, {
          //       name: 'DEVELOPMENT',
          //       y: 10
          //   },  {
          //       name: 'TOPS',
          //       y: 20
          //   }, {
          //       name: 'OTHERS',
          //       y: 25
          //   }
          // ]
      }]
    }
  }
  insuranceStatusChart(data:any){
    // console.log(data);
    this.insuranceNotInsured = [];
    this.insuranceExpired = [];
    this.insurancePending = [];
    this.insuranceInsured = [];
    data.filter((item:any)=>{
          this.insuranceNotInsured.push(item.notInsured)
          this.insuranceExpired.push(item.expired)
          this.insurancePending.push(item.pending)
          this.insuranceInsured.push(item.insured)
    })
    // console.log('notInsured',this.insuranceNotInsured)
    // data.map((item:any)=>console.log('item',item))
    this.chartOptionsInsurance= {
      colors:['#DEDEDE',
              '#E8463A',
              '#FFD500',
              '#42B808',],
      chart: {
        type: 'column',
        marginTop: 70,
        style: {
          fontFamily: 'Lato'
        },
        animation: true,
      },
      
      title: {
        text: null
      },
      xAxis: {
        categories: ['ATHLETE', 'COACH', 'SPORT SCIENTIST']
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        }
      },
      legend: {
          // layout: 'vertical',
          align: 'center',
          verticalAlign: 'top',
          // x: -40,
          y: -10,
          floating: true,
          borderWidth: 1,
          backgroundColor:'#FFFFFF',
          //     Highcharts?.defaultOptions?.legend.backgroundColor || '#FFFFFF',
          shadow: true
          // enabled: false
      },
      credits: {
        enabled: false
      },
      exporting: {
          enabled: false
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              pointPadding: 0.3,
          },
      },
      series: [
      {
        name: 'NOT INSURED',
        // data: [100, 80, 90],
        data: this.insuranceNotInsured
      },
      {
        name: 'EXPIRED',
        // data: [100,80,90],
        data: this.insuranceExpired,
      },
      {
        name: 'PENDING',
        // data: [120,100,70],
        data: this.insurancePending,
      },
      {
        name: 'INSURED',//
        // data: [120,80,90],
        data: this.insuranceInsured,
      },
      
    ]
    };
  }

  basicInfo(){
  this.basicInfoModalRef = this.modalService.open(BasicDetailsComponent,{ centered: true, keyboard: false,size: 'lg',backdrop: 'static'})
  }

  address(){
    this.addressRef = this.modalService.open(AddressDetailsComponent,{ centered: true, keyboard: false,size: 'xl',backdrop: 'static'})
  }
  SportDiscipline(){
    this.SportDisciplineRef = this.modalService.open(SportsDisciplineComponent,{ centered: true, keyboard: false,size: 'xl',backdrop: 'static',scrollable: true})
  }

  changeExport(event:any){
    const val = event.target.value
    if(val=='Excel'){
      this.getExcel();      
    }else if(val=='Pdf'){
      this.getPdf();
    }
  }
  getExcel(){
    const element = document.getElementById('achievement-table');
      const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
      // Adding custom heading in sheet
      const Heading = [['Sports Discipline', 'Gold', 'Silver', 'Bronze','Total']];
      XLSX.utils.sheet_add_aoa(ws, Heading);
      // XLSX.utils.sheet_add_json(ws,{skipHeader: true });
  
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
      /* save to file */  
      XLSX.writeFile(wb, 'Achievement.xlsx');
  }
  getPdf() {
    const doc = new jsPDF();
    var img = new Image();
    img.src = '../assets/images/NSRS.png';
    const temp = new jsPDF()
    autoTable(temp, { html: '#achievement-table' });
    for (let pageNumber = 1; pageNumber <= temp.getNumberOfPages(); pageNumber++) {
      doc.addImage(img, 'png', 0, 0, 200, 250);
      doc.addPage();
    }
    doc.setPage(1);
    autoTable(doc, { 
      html: '#achievement-table', 
      headStyles: { 
        valign: 'middle', 
        fillColor: '#1F60AB', 
        fontSize: 5 
      }, 
      theme: 'grid', 
      bodyStyles: { 
        fontSize: 7, 
        fillColor: false, 
        textColor: '#000' 
      },
      didDrawCell: (data) => {
        if(data.column.index === 1 && data.cell.section === 'head') {
          const text = 'GOLD'; // Replace text you want to insert
          // const dim = data.cell.height - data.cell.padding('vertical');
          const dim = data.cell.height;
          const textPos = data.cell;
          doc.text(text, textPos.x +(data.cell.width / 6), textPos.y + dim / 1.7, { align: 'center'});
        }else if(data.column.index === 2 && data.cell.section === 'head'){
          const text = 'SILVER'; 
          const dim = data.cell.height;
          const textPos = data.cell;
          doc.text(text, textPos.x +(data.cell.width / 5), textPos.y + dim / 1.7, { align: 'center'});
        }else if(data.column.index === 3 && data.cell.section === 'head'){
          const text = 'BRONZE';
          const dim = data.cell.height;
          const textPos = data.cell;
          doc.text(text, textPos.x +(data.cell.width / 4.5), textPos.y + dim / 1.7, { align: 'center'});
        }else if(data.column.index === 4 && data.cell.section === 'head'){
          const text = 'TOTAL'; 
          const dim = data.cell.height;
          const textPos = data.cell;
          doc.text(text, textPos.x +(data.cell.width / 6), textPos.y + dim / 1.7, { align: 'center'});
        }
      } 
      
    });
    doc.deletePage(temp.getNumberOfPages() + 1);
    doc.save('achievement.pdf');
  }

}
