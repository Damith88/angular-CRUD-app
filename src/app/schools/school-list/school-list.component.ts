import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SchoolListDataSource } from './school-list-datasource';
import {School} from '../school';
import {SchoolService} from '../school.service';
import { merge } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NewSchoolComponent } from '../new-school/new-school.component';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<School>;
  dataSource: SchoolListDataSource;
  searchForm: FormGroup;
  filters: object = {};
  filtersApplied: boolean = false;

  constructor(private schoolService: SchoolService, private dialog: MatDialog) {

  }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'address.street', 'address.suburb', 'address.state', 'address.postcode', 'studentCount'];

  ngOnInit() {
    this.dataSource = new SchoolListDataSource(this.schoolService);
    this.dataSource.loadSchools();
    this.searchForm = this.schoolService.getSearchForm();
  }

  search() {
    this.filtersApplied = true;
    this.filters = this.searchForm.value;
    this.paginator.pageIndex = 0;
    this.sort.active = 'name';
    this.sort.direction = 'asc';
    this.loadSchools();
  }

  resetFilters() {
    if (this.filtersApplied) {
      this.filters = {};
      this.paginator.pageIndex = 0;
      this.sort.active = 'name';
      this.sort.direction = 'asc';
      this.loadSchools();
      this.filtersApplied = false;
    }
  }

  openNewSchoolDialog() {
    const dialogRef = this.dialog.open(NewSchoolComponent, {width: '400px'});

    dialogRef.afterClosed().subscribe(result => {
      this.loadSchools();
    });
  }

  ngAfterViewInit() {
    this.table.dataSource = this.dataSource;

    merge(this.paginator.page, this.sort.sortChange).subscribe((next) => {
      this.loadSchools();
    })
  }

  loadSchools() {
    this.dataSource.loadSchools(
      this.filters,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );
  }
}
