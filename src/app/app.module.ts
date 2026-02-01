import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Main Components

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LandingComponent } from './components/landing/landing.component';

// Dashboard Components
import { IndividualCreditScoringModalComponent } from './components/dashboard/individual-credit-scoring-modal/individual-credit-scoring-modal.component';
import { PricingPlansModalComponent } from './components/dashboard/pricing-plans-modal/pricing-plans-modal.component';
import { PaymentModalComponent } from './components/dashboard/payment-modal/payment-modal.component';

// Login Components
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { SetPasswordComponent } from './components/login/set-password/set-password.component';
import { TwoStepVerificationComponent } from './components/login/two-step-verification/two-step-verification.component';
import { UserConsentComponent } from './components/login/user-consent/user-consent.component';
import { VerifyCodeComponent } from './components/login/verify-code/verify-code.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import {HttpClientModule} from "@angular/common/http";
import { SignUpParentComponent } from './components/login/sign-up-parent/sign-up-parent.component';
import { AuthInterceptor } from "./services/auth.interceptor";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// Standalone
import { TwoFactorAuthComponent } from './components/two-factor-auth/two-factor-auth.component';
import { SignupComponent } from './components/login/signup/signup.component';
import { BusinessCreditScoringModalComponent } from './components/dashboard/business-credit-scoring-modal/business-credit-scoring-modal.component';
import { ConfirmationModalComponent } from './components/dashboard/confirmation-modal/confirmation-modal.component';
import {AlertBannerComponent} from "./components/alert-banner/alert-banner.component";


@NgModule({
  declarations: [
    AppComponent,

    DashboardComponent,
    LandingComponent,
    LoginComponent,
    TwoFactorAuthComponent,
    IndividualCreditScoringModalComponent,
    PaymentModalComponent,
    ForgotPasswordComponent,
    SetPasswordComponent,
    SignupComponent,
    TwoStepVerificationComponent,
    UserConsentComponent,
    VerifyCodeComponent,
    IndividualCreditScoringModalComponent,
    PricingPlansModalComponent,
    PaymentModalComponent,
    SidebarComponent,
    SignUpParentComponent,
    BusinessCreditScoringModalComponent,
    ConfirmationModalComponent,
    AlertBannerComponent,

  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
      HttpClientModule

    ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
