import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth-service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  showIndividualModal = false;
  userName:any= '';
  email:any= '';
  ngOnInit() {
    this.userName=localStorage.getItem('userName');
    this.email=localStorage.getItem('email');
  }

  openIndividualCreditScoringModal() {
    console.log('Opening individual credit scoring modal');
    this.showIndividualModal = true;
  }
  @Output() closeSidebar = new EventEmitter<void>();

  logout() {
    this.authService.revokeToke().subscribe()
    localStorage.clear()
    this.router.navigate(['/login'])
  }
}
