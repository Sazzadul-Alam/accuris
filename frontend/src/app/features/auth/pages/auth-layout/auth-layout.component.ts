import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { LoginNavComponent } from '../signup-info/signup-nav/signup-nav.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
    selector: 'app-auth-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, SignupComponent],
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
    // Your layout logic here
}