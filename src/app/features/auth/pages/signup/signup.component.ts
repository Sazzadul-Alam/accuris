import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupNavComponent } from './signup-nav/signup-nav.component';
import { SignupPersonalInfoFormComponent } from "./signup-personal-info-form/signup-personal-info-form.component";
import { SignupTwoTierAuthFormComponent } from "./signup-two-tier-auth-form/signup-two-tier-auth-form.component";
import { SignupUserConsentFormComponent } from "./signup-user-consent-form/signup-user-consent-form.component";

@Component({
    selector: 'signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, SignupNavComponent, SignupPersonalInfoFormComponent, SignupTwoTierAuthFormComponent, SignupUserConsentFormComponent],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    activeStep: string = '1';

    constructor(private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.activeStep = params['step'] || '1';
        });
    }
}