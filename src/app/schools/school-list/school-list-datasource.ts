import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import {SchoolService} from '../school.service';
import {School} from '../school';

/**
 * Data source for the School list view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SchoolListDataSource extends DataSource<School> {

  private schoolsSubject = new BehaviorSubject<School[]>([]);

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);

  public total$ = this.totalSubject.asObservable();

  constructor(private schoolService: SchoolService) {
    super();
  }

  loadSchools(
                filters:object = {},
                sort:string = 'name',
                sortOrder:string = 'asc',
                page:number = 1,
                limit:number = 20) {

        this.loadingSubject.next(true);

        this.schoolService.findSchools(filters, sort, sortOrder,
            page, limit).pipe(
                catchError(() => observableOf({payload: [], meta: {totalCount: 0}})),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(searchResult => {
              this.totalSubject.next(searchResult.meta.totalCount);
              this.schoolsSubject.next(searchResult.payload);
            });

    }

    connect(collectionViewer: CollectionViewer): Observable<School[]> {
        console.log("Connecting data source");
        return this.schoolsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.schoolsSubject.complete();
        this.loadingSubject.complete();
    }
}
