import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import { CommonSharableService } from 'src/app/_common/services/common-services/commonSharable.service';
import { first, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from 'src/app/standalone_components/loader/loader.component';
import { CommonSportSpecificEducationService } from 'src/app/_common/services/role-inner-pages-services/common-role-services/common-sport-specific-education.service';
import { researchExperienceService } from 'src/app/_common/services/role-inner-pages-services/sport-scientist-services/research-experience.service';
import { CoachAchievementService } from 'src/app/_common/services/role-inner-pages-services/coach-services/coach-achievement.service';

@Component({
  selector: 'app-coach-popup-home',
  templateUrl: './coach-popup-home.component.html',
  styleUrls: ['./coach-popup-home.component.css'],
  standalone:true,
  imports:[CommonModule, LoaderComponent]
})
export class CoachPopupHomeComponent implements OnInit {
@ViewChild('pdfContent', { static: false }) pdfContent!:ElementRef;
@Input() officialId:any;
@Input() officialProfilePopupDetailsData:any;
@Input() academyCoachDetailPopUpData:any
loader:boolean = false;
postingCurrent:Array<any> = []
postingHistory:Array<any> = []
sportSpecificEducationData:any;
awardData:any
foreignExposureData:any
experienceInNationalCampData:any;
exportButton:boolean= true;
userDetail:any

  constructor(
    private commmonSharableService:CommonSharableService,
    private commonSportSpecificEducationService:CommonSportSpecificEducationService,
    private researchExperienceService:researchExperienceService,
    private coachAchievementService:CoachAchievementService,
  ) { }

  ngOnInit() {    
    // console.log('officialProfilePopupDetailsData', this.officialProfilePopupDetailsData)
    this.getOfficial_Training_Info();
  }
  getOfficial_Training_Info(){
    this.loader = true;
    const postingDetailsApi = this.commmonSharableService.Official_Training_Info_Academy(this.officialId);
    const sportSpecificEducationApi = this.commonSportSpecificEducationService.getOfficialDisciplineSpecificEducationDetails(this.officialId);
    const awardApi = this.researchExperienceService.officials_award_list(this.officialId);
    const foreignExposureApi = this.coachAchievementService.coachForeignExposure(this.officialId);
    const experienceInNationalCampApi = this.coachAchievementService.coachExpNationalCamp(this.officialId);    
    forkJoin([
      postingDetailsApi,
      sportSpecificEducationApi,
      awardApi,
      foreignExposureApi,
      experienceInNationalCampApi
    ]).pipe(first()).subscribe({
      next:(response:any)=>{
        this.loader = false;
        // console.log(response)
        this.postingCurrent = response[0].filter((item:any)=>item.period.includes('Present'))
        this.postingHistory = response[0].filter((item:any)=> !item.period.includes('Present'))
        this.sportSpecificEducationData = response[1]
        this.awardData = response[2]
        this.foreignExposureData = response[3]
        this.experienceInNationalCampData = response[4]
      },
      error:(err)=>{
        console.error(err);
        this.loader = false;
      }
    })
  }

  exportPDF(){
    this.exportButton = false;
    setTimeout(()=>{
      this.generatePdf();
    },500)        
  }
  generatePdf(){
    const pdfContentdElement = this.pdfContent.nativeElement;

    html2canvas(pdfContentdElement, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('coach-detail.pdf');
      this.exportButton = true
    });

    // const pdfContentElement = this.pdfContent.nativeElement;

    // html2canvas(pdfContentElement, { scale: 2 }).then(canvas => {
    //   const imgWidth = 210; // A4 width in mm
    //   const pageHeight = 297; // A4 height in mm
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;

    //   const pdf = new jsPDF('p', 'mm', 'a4');

    //   let heightLeft = imgHeight;
    //   let position = 0;

    //   const imgData = canvas.toDataURL('image/png');

    //   // Add first page
    //   pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //   heightLeft -= pageHeight;

    //   while (heightLeft > 0) {
    //     position = heightLeft - imgHeight;
    //     pdf.addPage();
    //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    //     heightLeft -= pageHeight;
    //   }

    //   pdf.save('coach-detail.pdf');
    //   this.exportButton = true
    // });

    //Gap in gape
    // const pdfContentElement = this.pdfContent.nativeElement;

    // html2canvas(pdfContentElement, { scale: 2 }).then(canvas => {
    //   const imgWidth = 210; // A4 width in mm
    //   const pageHeight = 297; // A4 height in mm
    //   const topMargin = 20;
    //   const bottomMargin = 20;
    //   const usablePageHeight = pageHeight - topMargin - bottomMargin;

    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   const pdf = new jsPDF('p', 'mm', 'a4');

    //   const imgData = canvas.toDataURL('image/png');

    //   let heightLeft = imgHeight;
    //   let position = 0;
    //   let pageNumber = 0;

    //   while (heightLeft > 0) {
    //     const currentPosition = topMargin + (position * usablePageHeight) / imgHeight;

    //     if (pageNumber > 0) {
    //       pdf.addPage();
    //     }

    //     pdf.addImage(
    //       imgData,
    //       'PNG',
    //       0,
    //       topMargin,
    //       imgWidth,
    //       imgHeight
    //     );

    //     heightLeft -= usablePageHeight;
    //     position++;
    //     pageNumber++;
    //   }

    //   pdf.save('coach-detail.pdf');
    //   this.exportButton = true
    // });
  }

}
