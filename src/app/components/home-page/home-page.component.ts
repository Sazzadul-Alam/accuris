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
    this.setData.emit();
  }
}
