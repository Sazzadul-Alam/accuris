import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./features/auth/pages/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
        children: [
            {
                path: 'signup/:step',
                loadComponent: () => import('./features/auth/pages/signup/signup.component').then(m => m.SignupComponent)
            },
        ]
    },
    {
        path: '**',
        redirectTo: '/auth/signup/1'
    }
];