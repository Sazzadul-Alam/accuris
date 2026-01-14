import { Component } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up-parent',
  templateUrl: './sign-up-parent.component.html',
  styleUrls: ['./sign-up-parent.component.css']
})
export class SignUpParentComponent {
  steps: number;
  stepFormData: {
    signup?: any;
    twoFactor?: any;
    consent?: any;
  } = {};
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit() {
    this.steps = 1;
  }
  returnHome() {
    this.router.navigate(['/']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  getFormValue(event: any) {
    switch (this.steps) {
      case 1:
        this.stepFormData.signup = event;
        break;

      case 2:
        this.stepFormData.twoFactor = event;
        break;

      case 3:
        this.stepFormData.consent = event;
        break;
    }



  }

  getStepValue($event: any) {
    this.steps = $event;
    console.log("step value from parent : ", this.steps)

  }
}
