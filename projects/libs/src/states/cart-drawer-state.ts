import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class CartDrawerState{
  readonly drawer = new BehaviorSubject<MatSidenav>(null);
}
