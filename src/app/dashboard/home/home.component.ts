import { Component } from '@angular/core';
import {IndividualInfoComponent} from "./individual-info/individual-info.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  modalRef?: BsModalRef;

  constructor(
              private modalService: BsModalService) {
  }
  onClick() {
    const initialState = {

    };
    this.modalRef = this.modalService.show(IndividualInfoComponent, {
      backdrop: 'static',
      keyboard: false,
      class: 'modal-dialog modal-dialog-centered modal-lg',
      initialState:initialState
    });

  }
}
