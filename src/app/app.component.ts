import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Express } from 'express';
import { Server } from 'http';
import { createServer } from 'https';
import { readFileSync } from 'fs';
// import cors from 'cors';
import { BodyParser } from 'body-parser';
import { Socket } from 'socket.io';
import { EventService } from './_services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  isAdmin = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  currentUser: any;
  showFiller = false;
  eventTomorrow: any;
  userActivityTomorrow: number = 0;
  tettte: any;
  listUserActivityTomorrow = [] as any;
  dateForm: any;
  month: any;
  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private http: HttpClient,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      // const user = this.storageService.getUser();
      // this.roles = user.roles;

      this.currentUser = this.storageService.getUser();
      this.http
        .get('http://localhost:8000/users/user')
        .subscribe((response) => {
          this.currentUser = response;
          console.warn('result', this.currentUser);
          if (this.currentUser.admin) {
            this.isAdmin = this.currentUser.admin;
            console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', this.isAdmin);
          } else {
            this.isAdmin = this.currentUser.admin;
            console.warn('BBBBBBBBBBBBBBBBBBBBBBB', this.isAdmin);
          }
        });
      
      this.http
        .get(
          'http://localhost:8000/activities/get_useractivity_for_notification'
        )
        .subscribe((data) => {
          this.eventTomorrow = data;

          for (let i = 0; i < this.eventTomorrow.length; i++) {
            for (let j = 0; j < this.eventTomorrow[i].userId.length; j++) {
              if ((this.eventTomorrow[i].userId[j] = this.currentUser.id)) {
                this.userActivityTomorrow = this.userActivityTomorrow + 1;
                this.eventTomorrow[i].date = this.con_date(
                  this.eventTomorrow[i].date
                );

                this.eventService
                  .get_useractivity_by_id(this.eventTomorrow[i].id)
                  .subscribe({
                    next: (data) => {
                      data.date = this.con_date(data.date);
                      this.tettte = data;
                      console.warn('ssss', this.tettte.date);
                      this.listUserActivityTomorrow.push(this.tettte);
                      let dad = this.listUserActivityTomorrow;
                      
                    },
                  });
              }
            }
          }
        });
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  con_date(d: any) {
    d = d.split('-');
    this.month = d[1];
    if (d[1] == '04') {
      d[1] = 'เมษายน';
    } else if (d[1] == '05') {
      d[1] = 'พฤษภาคม';
    }
    d[0] = parseInt(d[0]) + 543;
    this.dateForm = d.reverse().join(' ');
    return this.dateForm;
  }

  notification_bell(): void {
    localStorage.setItem('TABS', JSON.stringify(1));
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res);
        this.storageService.clean();
        localStorage.clear();
        window.location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.router.navigate(['/home']);
  }
}
