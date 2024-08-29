import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Page, UsersVm } from '../types/users.interfase';
import { FormsModule } from '@angular/forms';
import { LocalStorageJwtService } from '../services/local-storage-jwt.service';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorIntl } from '../ui-toolkit/paginator.toolkit';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatButtonModule, 
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    FormsModule,
    MatPaginatorModule
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ],
})
export class MainComponent implements OnInit{
  public openFilter = false;
  public addUser = false;
  public dataSource: MatTableDataSource<UsersVm> = new MatTableDataSource();
  public readonly columnsToDisplay: string[] = ['actions','checkbox','login','email', 'phone', 'roles', 'updatedAt', 'createdAt', 'status', 'ep'];
  public readonly statuses = ['ACTIVE', 'Not active'];
  public readonly roles = ['Администратор', 'Пользователь'];

  private readonly formBuilder = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  public pages: Page = { total: 0, current: 1, size: 10 };

  private localStore = inject(LocalStorageJwtService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public filterForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.min(3)]],
    phone: [null, [Validators.required, Validators.pattern('^\\+?[0-9]{10,}$')]], 
    create_at: [null],
    status: [''],
    email: ['', [Validators.required, Validators.email]],
    is_admin: [null],
    update_at: [null]
  });

  public onAdd() {
    this.addUser = !this.addUser;
    this.openFilter = false;
    this.filterForm.reset();
  }

  public onUnlock() {
    this.usersService.users$.subscribe((data) =>this.dataSource.data = data);
  }

  public onLock() {
    this.usersService.filteredUsers$.subscribe((data) => this.dataSource.data = data);
  }

  public onFilter() {
    this.openFilter = !this.openFilter;
    this.addUser = false;
    this.filterForm.reset();
  }

  public onSubmit(user: UsersVm) {
    if (this.addUser) {
      this.usersService.addUser(user);
    }
    else if (this.filterForm) {
      this.usersService.filterUsers(user);
      this.usersService.filteredUsers$.subscribe((data) => this.dataSource.data = data);
    }
  }

  public onCancel() {
    this.filterForm.reset();
    this.addUser = false;
    this.openFilter = false;
  }

  ngOnInit(): void {
    const localStorageUsers = this.localStore.getItem();
    !localStorageUsers ? this.usersService.loadUsers() : this.usersService.loadUsersLocalStorage(JSON.parse(localStorageUsers));    
    this.usersService.users$.subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    })
    this.usersService.pages$.subscribe((pages) => this.pages = pages)
  }
}
