import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root',
})

export class KIAAProposalService{

    constructor(private _http:HttpClient){}

    getKiaaProposalList(academyDetailId:any){
        // return this._http.get(`${environment.kitdUrl}NSRSKIAA/Get_Kiaa_Proposal_Details?Academy_Detail_id=${academyDetailId}`)
        return this._http.get(`${environment.apiURL}Academy/Get_Kiaa_Proposal_Details?Academy_Detail_id=${academyDetailId}`)
        // return this._http.get(`${environment.kitdUrl}NSRSKIAA/Get_Kiaa_Proposal_Details?Academy_Detail_id=0`)
    }

    getDisciplineOnAcademyId(academyId:any,sportDetailId:any){
        return this._http.get(`${environment.apiURL}Academy/GetKIAA_Academy_Dicipline?academyid=${academyId}&SportsId=${sportDetailId}`)
    }

    getEOIData(proposalId:any){
        return this._http.get(`${environment.apiURL}Academy/GetKIAA_Academy_Detail?ProposalId=${proposalId}`)
    }

    saveEOI(payload:any){
        return this._http.post(`${environment.apiURL}Academy/RequestKIAA_Academy`,payload)
    }
}