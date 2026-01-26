import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from "./services/auth-service";
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getToken();
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const isValid = await firstValueFrom(authService.validateToken(token));
  if (!isValid) {
    authService.removeToken();
    router.navigate(['/login']);
    return false;
  }

  return true;
};


// {
//   "access_token": "eyJraWQiOiJjYmRkYjBiNi1lYjNhLTRmODQtYTA1My1jNjY5NjdiZTBjYjUiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJqb25hdGhvbi5iYXJvaS4yMDAxQGdtYWlsLmNvbSIsImF1ZCI6IndlYiIsIm5iZiI6MTc2OTA2ODQ1Miwic2NvcGUiOlsib3BlbmlkIl0sImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MjAwMiIsImV4cCI6MTc2OTA3MDI1MiwiaWF0IjoxNzY5MDY4NDUyLCJqdGkiOiJlMzUzZDNhOC02NGI1LTQzMWEtOWVjOC1mYzBjYjFkNjM0NjMifQ.JS0cQSmF5hu_85XsMY53D17OcIF9--DkH0SgKblt5a7fm72tzcB0pTBla9woK_eYlKOyoLQi3-FKp0PDn4uc7GywXxK50tsmiz8vWHr-sTyc8fo6joBksgeX0Tlj1jvOhMiI5ep_XQs3Murv6QtRAQ5N5t0g6ILSi-ypVbqBIar_UjJIe1RWC2D9E6bPDR7FGFrRac7XO_Tngf3ZdwfudXN8a7h6QWxlRWjLXFqxdL6Dkgbu6ArauTk-5gXDjjTdkeP4RrirtsskawLJCzZvJWLW2cklS9SZO_6jsv8sOm5SxOc6yQzHKDoGXlev06KuT76qA-ic9o4hR-qEcvc4dg",
//   "refresh_token": "IjizPZGwLUYD9sOhgBmAZCNxfFAoNzcv5aXACojz0fEGkSJRyNixq3EVtuDscD-VwxM0nUV1NNuM2MaYEaVO-ColtX8amggmPLvRLHx8Vh93S_JSH72H-BP13N_QALmN",
//   "scope": "openid",
//   "id_token": "eyJraWQiOiJjYmRkYjBiNi1lYjNhLTRmODQtYTA1My1jNjY5NjdiZTBjYjUiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJqb25hdGhvbi5iYXJvaS4yMDAxQGdtYWlsLmNvbSIsImF1ZCI6IndlYiIsImF6cCI6IndlYiIsImF1dGhfdGltZSI6MTc2OTA2ODQ1MiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDoyMDAyIiwiZXhwIjoxNzY5MDcwMjUyLCJpYXQiOjE3NjkwNjg0NTIsImp0aSI6Ijc0NmVkMDg5LWU0ZDgtNDY2OS05NzAyLWNlYmUyODUyYWMyOSIsInNpZCI6IkdqLXlURjlSYjJoLXJqSUxLZEhoVlZFY0FXNkxleDROdHowTlhnNUNDeGsifQ.eBrFl3QTKgOLrFEgXvuhYo73I-kktUawXobquX64YFRRMfoxqHb4V6DtLZsEVe24HS_3Rjm8wLw-iDKGlCZN_vMkcZQhn9I-JqQUDZdz9feaEqppbYaWYBPbKj4_qPajry60vsvW-OdfPKee-0KVT0sy9_VC-9Zb3kSapkmoQlI88olZDJmEUETwBmcKZCVPHoYXal5y2tGnBCXPw-5pVSec3hHAnMJ3kJhGg2BxMmhKrKiq8kaJnCLqmnK1nU8hxGrd_0xkh87JAYi2UuhI1VorfXgi_1gVgUDabs0a1z0PrcgrHd79B5IIiC8IzOivA3Mw-2y-bnpXSvv6CAW98w",
//   "token_type": "Bearer",
//   "expires_in": 1799
// }
