import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // Your other app routes (e.g., home, dashboard) go here.
    // { path: 'home', component: HomeComponent },

    // NOTE: You do NOT add any 'auth' routes here.
    // They are automatically added by importing AuthModule in app.module.ts.
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }