import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NewSchoolComponent } from './new-school.component';
import { SchoolService } from '../school.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../material.module';

describe('NewSchoolComponent', () => {
  let component: NewSchoolComponent;
  let fixture: ComponentFixture<NewSchoolComponent>;
  let httpTestingController: HttpTestingController;
  let dialogRef: any;

  beforeEach(async(() => {
    dialogRef = jasmine.createSpyObj('MatDialogRef<NewSchoolComponent>', ['close']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule
      ],
      declarations: [ NewSchoolComponent ],
      providers: [
        SchoolService,
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRef }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSchoolComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
  });

  describe('#ngOnInit', () => {
    it('should setup the school create form', () => {
      expect(component.createForm).toBeFalsy();
      component.ngOnInit();
      expect(component.createForm).toBeInstanceOf(FormGroup);
      expect(component.createForm.contains('name')).toBeTruthy();
      expect(component.createForm.contains('address')).toBeTruthy();
      expect(component.createForm.contains('studentCount')).toBeTruthy();
    });
  });

  describe('#cancel', () => {
    it('should close the dialog', () => {
      component.cancel();
      expect(dialogRef.close.calls.count()).toEqual(1);
    });
  });

  describe('#createSchool', () => {
    it('should close the dialog if the form is valid', () => {
      component.ngOnInit();
      component.createForm.controls.name.setValue('New School');
      let address = component.createForm.controls.address as FormGroup;
      address.controls.street.setValue('corner street');
      component.createForm.controls.studentCount.setValue('123');
      expect(component.createForm.valid).toBeTrue();
      component.createSchool();

      const req = httpTestingController.expectOne('/api/schools');
      expect(req.request.method).toEqual('POST');
      const createSchoolBody = {
        name: 'New School',
        studentCount: '123',
        address: {
          street: 'corner street',
          suburb: '',
          state: '',
          postcode: ''
        }
      };
      expect(req.request.body).toEqual(createSchoolBody);
      const createSchoolResponse = Object.assign({}, {_id: 123}, createSchoolBody);
      req.flush(createSchoolResponse);
      expect(dialogRef.close.calls.count()).toEqual(1);
      expect(dialogRef.close.calls.mostRecent().args[0]).toEqual(createSchoolResponse);
      httpTestingController.verify();
    });

    it('should not close the dialog if the form is invalid', () => {
      component.ngOnInit();
      component.createForm.controls.name.setValue('New School');
      let address = component.createForm.controls.address as FormGroup;
      address.controls.street.setValue('corner street');
      component.createForm.controls.studentCount.setValue('NaN');
      expect(component.createForm.valid).toBeFalse();
      component.createSchool();
      expect(dialogRef.close.calls.count()).toEqual(0);
      httpTestingController.verify();
    });
  });
});
