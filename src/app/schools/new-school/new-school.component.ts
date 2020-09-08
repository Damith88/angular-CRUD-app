import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SchoolService } from '../school.service';
import { MatDialogRef } from '@angular/material/dialog';
import { School } from '../school';

@Component({
  selector: 'app-new-school',
  templateUrl: './new-school.component.html',
  styleUrls: ['./new-school.component.scss']
})
export class NewSchoolComponent implements OnInit {
  createForm: FormGroup;

  constructor(private schoolService: SchoolService, private dialogRef: MatDialogRef<NewSchoolComponent>, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm = this.getCreateForm();
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

  createSchool() {
    if (this.createForm.valid) {
      this.schoolService.createSchool(this.createForm.value).subscribe((school: School) => {
        this.dialogRef.close(school);
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
