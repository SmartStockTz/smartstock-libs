import {Injectable} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceState {

  isSmallScreen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enoughWidth: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly breakPoint: BreakpointObserver) {
    this.breakPoint.observe('(max-width: 599px)')
      .subscribe(value => {
        if (value) {
          this.isSmallScreen.next(value.matches);
        } else {
          this.isSmallScreen.next(false);
        }
      });
    this.breakPoint.observe('(min-width: 1000px)')
      .subscribe(value => {
        if (value) {
          this.enoughWidth.next(value.matches);
        } else {
          this.enoughWidth.next(false);
        }
      });
  }

}
