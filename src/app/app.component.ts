import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Subject, debounceTime, distinctUntilChanged, filter, switchMap, of, delay, catchError, map, combineLatest } from 'rxjs';
import { ApiService } from './services/api-service/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SplitButtonModule,
    TableModule,
    RouterOutlet, 
    FormsModule, 
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private searchTerms = new Subject<string>();
  results:any = [];
  tests:any =  [{ label: 'Edit'}, {label:'Delete'}]
  tasks:any = [];
  combinedResults: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {
    this.apiService.getTodo().pipe(
      // map(val=>val)
    ).subscribe(res=>{
      this.tasks=res
      this.results=res
      
      this.setupSearch();
    })
    this.apiService.getUserDetails(1).subscribe(res=>{
      console.log(res)
    })
    this.apiService.getUserPosts(1).subscribe(res=>{
      console.log(res)
    })
  }

  onSearch(event: Event): void {
    console.log('hit search term')
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchTerms.next(searchTerm);
  }

  private setupSearch(): void {
    this.searchTerms
      .pipe(
        debounceTime(300), 
        distinctUntilChanged(), 
        filter(term => term.length > 2), 
        switchMap(term => {
          this.loading = true;
          this.error = null;

          return of(this.mockApiCall(term)).pipe(
            // delay(500),
            catchError(err => {
              this.error = 'Error fetching results';
              return of([]);
            })
          );
        })
      )
      .subscribe(results => {
        this.results = results;
        this.loading = false;
      });
  }

  private mockApiCall(term: string) {
    return this.tasks.filter((item:any) =>
      item.title.includes(term.toLowerCase())
    );
  }

  save(param:string){
    console.log('save',param)
    combineLatest([
      this.apiService.getUserDetails(1),
      this.apiService.getUserPosts(1),
    ]).pipe(
      catchError(error => {
        this.error = 'Error fetching combined results';
        this.loading = false;
        return [];
      })
    )
    .subscribe(([userDetails, userPosts]) => {
      console.log('detail',userDetails)
      console.log('post',userPosts)
      this.combinedResults = userPosts.map(post => ({
        ...post,
        userName: userDetails.name,
        userEmail: userDetails.email,
      }));
      console.log('post',this.combinedResults)
      this.loading = false;
    });
  }



  // /////////////////////////////////////////
  private CombineOperators(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(term => term.length > 2),
        switchMap(term => {
          this.loading = true;
          this.error = null;

          // Assuming the search term is a user ID for simplicity
          const userId = parseInt(term, 10);

          return combineLatest([
            this.apiService.getUserDetails(userId),
            this.apiService.getUserPosts(userId),
          ]).pipe(
            catchError(error => {
              this.error = 'Error fetching combined results';
              this.loading = false;
              return [];
            })
          );
        })
      )
      .subscribe(([userDetails, userPosts]) => {
        this.combinedResults = userPosts.map(post => ({
          ...post,
          userName: userDetails.name,
          userEmail: userDetails.email,
        }));
        this.loading = false;
      });
  }
}