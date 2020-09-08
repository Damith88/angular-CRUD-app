import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SchoolService } from './school.service';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('SchoolService', () => {
  let httpTestingController: HttpTestingController;
  let schoolService: SchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [ HttpClientTestingModule ],
      // Provide the service-under-test and its dependencies
      providers: [
        SchoolService
      ]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    schoolService = TestBed.inject(SchoolService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('#findSchools', () => {
    it('should call httpClient service with default search params', () => {
      const params = new HttpParams()
            .set('sort', 'name')
            .set('sortOrder', 'asc')
            .set('page', '1')
            .set('limit', '20')
            .set('name', 'A')
            .set('address[street]', 'B');
      schoolService.findSchools({name: 'A', address: {street: 'B'}}).subscribe();

      const req = httpTestingController.expectOne('/api/schools?' + params.toString());
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('#createSchool', () => {
    it('should call httpClient service with request body', () => {
      const body = {
        name: 'A',
        studentCount: 120
      };
      schoolService.createSchool(body).subscribe();

      const req = httpTestingController.expectOne('/api/schools');
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(body);
    });
  });
});
