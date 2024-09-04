import { Component, OnInit } from '@angular/core';
import { of, delay, finalize, catchError, throwError, combineLatest, map, from, interval, take, tap, switchMap } from 'rxjs';
import { ApiService } from '../services/api-service/api.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModelService } from '../services/model/model.service';

@Component({
  selector: 'app-combine-latest',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule
  ],
  templateUrl: './combine-latest.component.html',
  styleUrl: './combine-latest.component.scss'
})
export class CombineLatestComponent implements OnInit{
 constructor(public modelService: ModelService){}
  ngOnInit() {
  }
}
