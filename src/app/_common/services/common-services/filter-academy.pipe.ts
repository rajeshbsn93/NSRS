import { Pipe, PipeTransform } from '@angular/core';
import { IAcademyList } from '../role-inner-pages-services/coach-services/coaching-info.service';

@Pipe({
  name: 'filterAcademy',
   standalone: true
})
export class FilterAcademyPipe implements PipeTransform {

//  transform(academies: IAcademyList[], searchText: string): IAcademyList[] {
//     if (!academies) return [];
//     if (!searchText) return academies;

//     const lower = searchText.toLowerCase();
//     return academies.filter(a => a.academy_name.toLowerCase().includes(lower));
//   }
transform(academies: IAcademyList[], searchText: string): IAcademyList[] {
    if (!academies) return [];
    if (!searchText) return academies;

    const lower = searchText.toLowerCase();
    return academies.filter(a =>
      a.academy_name.toLowerCase().includes(lower)
    );
  }

}
