import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SchoolListComponent } from './school-list.component';
import { SchoolService } from '../school.service';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';
import { SchoolListDataSource } from './school-list-datasource';
import { HttpParams } from '@angular/common/http';

describe('SchoolListComponent', () => {
  let component: SchoolListComponent;
  let fixture: ComponentFixture<SchoolListComponent>;
  let httpTestingController: HttpTestingController;
  let dialog: any;
  let defaultSearchParams = new HttpParams()
    .set('sort', 'name')
    .set('sortOrder', 'asc')
    .set('page', '1')
    .set('limit', '20');

  beforeEach(async(() => {
    dialog = jasmine.createSpyObj('MatDialogRef', ['open']);
    TestBed.configureTestingModule({
      declarations: [ SchoolListComponent ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MaterialModule,
        ReactiveFormsModule
      ],
      providers: [
        SchoolService,
        FormBuilder,
        { provide: MatDialog, useValue: dialog }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolListComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
  });

  describe('#ngOnInit', () => {
    it('should initialise the search form, datasource and load data', () => {
      expect(component.searchForm).toBeFalsy();
      expect(component.dataSource).toBeFalsy();
      component.ngOnInit();
      expect(component.dataSource).toBeInstanceOf(SchoolListDataSource);
      expect(component.searchForm).toBeInstanceOf(FormGroup);
      expect(component.searchForm.contains('name')).toBeTruthy();
      expect(component.searchForm.contains('address')).toBeTruthy();
      httpTestingController.expectOne('/api/schools?' + defaultSearchParams.toString());
      httpTestingController.verify();
    });
  });

  describe('#search', () => {
    it('should load schools resetting sort and pagination', () => {
      fixture.detectChanges();
      component.searchForm.controls.name.setValue('A');
      component.sort.direction = 'desc';
      component.paginator.pageIndex = 2;
      component.search();
      let searchParams = defaultSearchParams.set('name', 'A');
      expect(component.sort.direction).toEqual('asc');
      expect(component.paginator.pageIndex).toEqual(0);
      httpTestingController.expectOne('/api/schools?' + defaultSearchParams.toString());
      httpTestingController.expectOne('/api/schools?' + searchParams.toString());
      httpTestingController.verify();
    });
  });

  describe('#resetFilters', () => {
    it('should load schools resetting filters, sort and pagination', () => {
      fixture.detectChanges();
      component.searchForm.controls.name.setValue('A');
      component.search();
      let searchParams = defaultSearchParams.set('name', 'A');
      component.sort.direction = 'desc';
      component.paginator.pageIndex = 2;
      component.resetFilters();
      expect(component.sort.direction).toEqual('asc');
      expect(component.paginator.pageIndex).toEqual(0);
      let requests = httpTestingController.match('/api/schools?' + defaultSearchParams.toString());
      httpTestingController.expectOne('/api/schools?' + searchParams.toString());
      expect(requests.length).toEqual(2);
      httpTestingController.verify();
    });

    it('should not do anything if not previously searched', () => {
      fixture.detectChanges();
      component.sort.direction = 'desc';
      component.resetFilters();
      expect(component.sort.direction).toEqual('desc');
      httpTestingController.expectOne('/api/schools?' + defaultSearchParams.toString());
      httpTestingController.verify();
    });
  });

  describe('#openNewSchoolDialog', () => {
    it('should open new school dialog and should not reload if cancelled', () => {
      fixture.detectChanges();
      let dialogRef = jasmine.createSpyObj('MatDialogRef<NewSchoolComponent>', ['afterClosed']);
      dialogRef.afterClosed.and.returnValue(of(''));
      dialog.open.and.returnValue(dialogRef);
      component.openNewSchoolDialog();
      expect(dialog.open.calls.count()).toEqual(1);
      httpTestingController.expectOne('/api/schools?' + defaultSearchParams.toString());
      httpTestingController.verify();
    });

    it('should open new school dialog and reload schools once the dialog closed', () => {
      fixture.detectChanges();
      let dialogRef = jasmine.createSpyObj('MatDialogRef<NewSchoolComponent>', ['afterClosed']);
      dialogRef.afterClosed.and.returnValue(of({name: 'A'}));
      dialog.open.and.returnValue(dialogRef);
      component.openNewSchoolDialog();
      expect(dialog.open.calls.count()).toEqual(1);
      const requests = httpTestingController.match('/api/schools?' + defaultSearchParams.toString());
      expect(requests.length).toEqual(2);
      httpTestingController.verify();
    });
  });
});
