import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./components/landing/landing.component";
import {LoginComponent} from "./components/login/login.component";
import {SignupComponent} from "./components/login/signup/signup.component";
import {TwoFactorAuthComponent} from "./components/two-factor-auth/two-factor-auth.component";
import {UserConsentComponent} from "./components/login/user-consent/user-consent.component";
import {TwoStepVerificationComponent} from "./components/login/two-step-verification/two-step-verification.component";
import {ForgotPasswordComponent} from "./components/login/forgot-password/forgot-password.component";
import {VerifyCodeComponent} from "./components/login/verify-code/verify-code.component";
import {SetPasswordComponent} from "./components/login/set-password/set-password.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  { path: '', component: LandingComponent },

  { path: 'landing', component: LandingComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component:SignupComponent},
  { path:'two-factor-auth', component:TwoFactorAuthComponent},
  { path: 'user-consent', component: UserConsentComponent},
  { path: 'two-step-verification', component: TwoStepVerificationComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'forgot-password/verify-code', component: VerifyCodeComponent},
  { path: 'set-password', component: SetPasswordComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: '**', component: LandingComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
