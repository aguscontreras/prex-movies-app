import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  toggleLoader() {
    const loading = this.loading.value;
    console.log(loading);
    this.loading.next(!loading);
  }
}
