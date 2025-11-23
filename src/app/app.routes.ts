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
            {
                // New login route
                path: 'login',
                loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
            },
            {
                // New login route
                path: 'login-test',
                loadComponent: () => import('./login-test/login-test.component').then(m => m.LoginTestComponent)
            },
            {
                // 2fa route
                path: '2fa',
                loadComponent: () => import('./features/auth/pages/verification/verification.component').then(m => m.VerificationComponent)
            },
            {
                // forgot password route
                path: 'forgot-password',
                loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
            }
            
        ]
    },
    {
        // forgot password route
        path: 'product-page',
        loadComponent: () => import('./features/product-page/product-page.component').then(m => m.ProductPageComponent)
    },
    {
        path: '**',
        redirectTo: '/auth/login' // Often good to redirect to login if the user hasn't specified a valid route
    }
];