import { Injectable, inject } from '@angular/core';
import { Page, UsersVm} from '../types/users.interfase';
import { UsersApiService } from './users-api.service';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { LocalStorageJwtService } from './local-storage-jwt.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersApi = inject(UsersApiService);
  private localStore = inject(LocalStorageJwtService);

  private subjectUsers = new BehaviorSubject<UsersVm[]>([]);
  private subjectFilteredUsers = new BehaviorSubject<UsersVm[]>([]);
  private subjectPages = new Subject<Page>();

  public users$ = this.subjectUsers.asObservable();
  public filteredUsers$ = this.subjectFilteredUsers.asObservable();
  public pages$ = this.subjectPages.asObservable();

  public loadUsers() {
    this.usersApi.getUsers()
      .pipe(
        map((el) => {
          this.subjectPages.next(el.page);
          return el;
        }),
        map((el) => el.data.map((data) => ({
          ...data,
          ...el.users.find(user => user.id === data.user_id) 
          || {}
        }))),
      )
      .subscribe((newData) => {
        this.subjectUsers.next(newData as UsersVm[]);
      });
  }

  public loadUsersLocalStorage(users: UsersVm[]) {
    this.subjectUsers.next(users);
  }
  
  public addUser(newUser: UsersVm) {
    this.subjectUsers.next([...this.subjectUsers.value,newUser]);
    this.localStore.setItem(JSON.stringify(this.subjectUsers.value));
  }

  public filterUsers(filteredUser: UsersVm) {
    this.subjectUsers.pipe(
      map(el => el.filter(user => user.name === filteredUser.name || user.email === filteredUser.email))
    ).subscribe((newData) => {
      this.subjectFilteredUsers.next(newData)
    })
  }
}
