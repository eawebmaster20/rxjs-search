import { Injectable } from '@angular/core';
import { from, interval, tap, switchMap, combineLatest, take, map } from 'rxjs';
import { ApiService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ModelService {

  array1 = [1, 2, 3, 4];
  array2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  array3 = ['X', 'Y', 'Z'];
  combinedList:any=[]
  array1$ = from(this.array1);
  array2$ = from(this.array2);
  array3$ = from(this.array3);
  
  interval$ = interval(1000);

  constructor(private apiService: ApiService){}
  combine(){
    let i = 0
    this.interval$.pipe(
      tap(() => i++),
      switchMap(() => 
        combineLatest([
          this.array1$.pipe(take(i)), 
          this.array2$.pipe(take(i)),
          this.array3$.pipe(take(i)),
          this.apiService.getUserDetails(Math.floor(Math.random() * 10) + 1)
        ])
      ),
      map(([val1, val2, val3, val4]) => ({ val1, val2, val3, val4 })),
      take(5) 
    ).subscribe({
      next: (value) => {
        this.combinedList.push(value);
        console.log(value)}
        ,
      complete: () => console.log('Complete!')
    });
  }
}
