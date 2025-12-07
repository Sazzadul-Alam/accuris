import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { IndividualInfoComponent } from './home/individual-info/individual-info.component';
import {RouterModule} from "@angular/router";
import {ModalModule} from "ngx-bootstrap/modal";


@NgModule({
  declarations: [
    HomeComponent,
    IndividualInfoComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    RouterModule,
    ModalModule.forChild()
  ]
})
export class DashboardModule { }
