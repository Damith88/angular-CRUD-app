import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { School } from "./school";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface SearchResult {
    payload: School[];
    meta: {
        totalCount: number
    }
}


@Injectable({
  providedIn: 'root'
})
export class SchoolService {

    constructor(private http: HttpClient, private fb: FormBuilder) {

    }

    getSearchForm(): FormGroup {
      return this.fb.group({
        name: [''],
        address: this.fb.group({
          street: [''],
          suburb: [''],
          state: [''],
          postcode: ['']
        })
      });
    }

    getCreateForm(): FormGroup {
      return this.fb.group({
        name: ['', Validators.required],
        address: this.fb.group({
          street: [''],
          suburb: [''],
          state: [''],
          postcode: ['']
        }),
        studentCount: ['', Validators.pattern(/^\d+$/)]
      });
    }

    findSchools(
        filters: any = {}, sort = 'name', sortOrder = 'asc',
        page = 1, limit = 20): Observable<SearchResult> {

        let params = new HttpParams()
            .set('sort', sort)
            .set('sortOrder', sortOrder || 'asc')
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (filters.name) {
            params = params.set('name', filters.name);
        }

        if (filters.address) {
            ['street', 'state', 'suburb', 'postcode'].forEach((field) => {
                if (filters.address[field]) {
                    params = params.set(`address[${field}]`, filters.address[field]);
                }
            });
        }

        return this.http.get<SearchResult>('/api/schools', {
            params
        });
    }

    createSchool(body: any) {
      return this.http.post<School>('/api/schools', body);
    }

}