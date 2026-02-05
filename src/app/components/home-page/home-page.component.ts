import {Component, EventEmitter, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DashboardService} from "../../services/dashboard_service/dashboard.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private dashboardService: DashboardService,
  ) {
  }
  @Output() setData = new EventEmitter();

  nextPage() {
    const formData = new FormData();
    formData.append('userId', localStorage.getItem('user_id') || '');

    this.dashboardService.isDashBoardShow(formData)
      .subscribe(
        response => {
          this.setData.emit();
        },
        error => {
          console.error(error);
          // handle error
        }
      );



  }
}
