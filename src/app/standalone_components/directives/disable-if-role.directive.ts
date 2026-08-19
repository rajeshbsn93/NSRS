import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { StorageService } from 'src/app/_common/services/common-services/storage.service';

@Directive({
  selector: '[btnDisableIfRole]',
  standalone:true,
})
export class DisableIfRoleDirective {

  @Input('btnDisableIfRole') restrictedRoles: number[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _storageService: StorageService,
  ) {}

ngOnInit(): void {
    const currentRoleId = this._storageService.getUserDetails().role_id;
    if (this.restrictedRoles.includes(currentRoleId)) {

      //  this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
      this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
      this.renderer.listen(this.el.nativeElement, 'click', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
      });

            // this.renderer.setStyle(this.el.nativeElement, 'cursor', 'not-allowed');
      // this.renderer.setAttribute(this.el.nativeElement, 'title', 'Permission denied')
    }
}
}
