import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/_services/event.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmEditVolunteerListComponent } from './confirm-edit-volunteer-list/confirm-edit-volunteer-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarMessageComponent } from 'src/app/snack-bar-message/snack-bar-message.component';

@Component({
  selector: 'app-admin-manage-volunteer-list',
  templateUrl: './admin-manage-volunteer-list.component.html',
  styleUrls: ['./admin-manage-volunteer-list.component.css'],
})
export class AdminManageVolunteerListComponent implements OnInit {
  constructor(
    private eventService: EventService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ConfirmEditVolunteerListComponent>,
    private _snackBar: MatSnackBar
  ) {}

  durationInSeconds = 5;
  userActivityId: any;
  VolunteerList: any;
  settext: string = '';

  displayedColumns: string[] = [
    'name',
    'gender',
    'birthday',
    'religion',
    'phoneNumber',
    'career',
    'congenitalDisease',
    'allergicFood',
  ];

  dataSource = new MatTableDataSource<any>();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    let data: any = localStorage.getItem('ADMINEVENT');
    this.userActivityId = JSON.parse(data);
    console.log(this.userActivityId);
    this.get_data();
  }

  get_data() {
    this.eventService
      .get_user_in_userAc(this.userActivityId.currentActivityId)
      .subscribe({
        next: (data) => {
          this.VolunteerList = data;
          this.dataSource = new MatTableDataSource(this.VolunteerList);
          console.log('test', this.VolunteerList);
        },
      });
  }

  openDialogEditVolunteerList(userId: number) {
    this.dialog
      .open(ConfirmEditVolunteerListComponent)
      .afterClosed()
      .subscribe((result) => {
        this.get_data();
      });
    let data = { userId };
    localStorage.setItem('REMOVEVOLUNTEERLIST', JSON.stringify(data));
  }

  finish_activity() {
    this.eventService
      .finish_activity(this.userActivityId.currentActivityId)
      .subscribe({
        next: (data) => {
          console.warn(data);
        },
      });
    this.settext =
      'กิจกรรม:' +
      ' ' +
      this.userActivityId.currentActivityName +
      '  ' +
      'วันที่:' +
      '  ' +
      this.userActivityId.date +
      '  ' +
      'เสร็จสิ้นกิจกรรม';
    let message = { text: this.settext };
    localStorage.setItem('MESSAGE', JSON.stringify(message));
    this._snackBar.openFromComponent(SnackBarMessageComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
}
