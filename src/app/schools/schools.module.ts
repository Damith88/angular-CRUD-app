import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { SchoolsRoutingModule } from './schools-routing.module';
import { SchoolListComponent } from './school-list/school-list.component';
import { NewSchoolComponent } from './new-school/new-school.component';


@NgModule({
  declarations: [SchoolListComponent, NewSchoolComponent],
  imports: [
    CommonModule,
    SchoolsRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    NewSchoolComponent
  ]
})
export class SchoolsModule { }
