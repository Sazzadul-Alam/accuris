import { Component } from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-individual-info',
  templateUrl: './individual-info.component.html',
  styleUrls: ['./individual-info.component.css']
})
export class IndividualInfoComponent {
  constructor(public modalRef: BsModalRef) { }
}
