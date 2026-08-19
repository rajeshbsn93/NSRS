import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})
export class KheloIndiaGamesService{
    constructor(
        private http:HttpClient
    ){}
    getGamesList(){
        return this.http.get(`${environment.apiURL}Master/GamesList`)
      }
      Get_St_UniList(gameType:number){
        return this.http.get(`${environment.apiURL}Master/Get_St_UniList?gameType=${gameType}`)
      }
      getGameStateUniDetail(
        Player_Detail_id:number,
        Role_id:number
        ){
        return this.http.get<GetGameStateUniDetailsEntity>(`${environment.apiURL}Athlete/GetGameStateUniDetail?Player_Detail_id=${Player_Detail_id}&Role_id=${Role_id}`)
      }
      addGameStateUniDetail(payload:any){
        return this.http.post<GetGameStateUniDetailEntity>(`${environment.apiURL}Athlete/AddGameStateUniDetail`,payload)
      }
      deleteGameStateUniDetail(
        id:number,
        roleId:number,
        PlayerofficialId:number
        ){
        return this.http.get(`${environment.apiURL}Athlete/DeleteGameStateUniDetail?Id=${id}&RoleId=${roleId}&PlayerofficialId=${PlayerofficialId}`)
      }
      downloadTournamentGalary(filePath:any){
        return this.http.get(`${environment.apiURL}Athlete/DownloadTournamentGalary?FilePath=${filePath}`,{responseType:'blob'})
      }

}

export interface GetGameStateUniDetailsEntity{
  status: number
  code: number
  message: string
  data: GetGameStateUniDetailEntity[]
}
export interface GetGameStateUniDetailEntity{
  id: number
  roleId: number
  playerofficialid: number
  stuniId: number
  gameId: number
  isEdit: boolean
  isVerified: boolean
  stuniname: string
  gamename: string
}

export interface certificateDetailsEntity{
  certificate_Type: string
  certificate_number: number
  position: string
  event_id: number
  event_name:string
}
