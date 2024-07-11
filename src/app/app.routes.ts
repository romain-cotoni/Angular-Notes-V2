import { Routes } from '@angular/router';

import { RegisterComponent } from './core/components/register/register.component';
import { LoginComponent } from './core/components/login/login.component';
import { LogoutComponent } from './core/components/logout/logout.component';
import { EditorComponent } from './editor/components/editor/editor.component';
import { ShareNoteComponent } from './editor/components/share-note/share-note.component';
import { DashboardComponent } from './dashboard/components/dashboard/dashboard.component';
import { ProfilComponent } from './profil/components/profil/profil.component';
import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
  { path: 'register'  , component: RegisterComponent                             },
  { path: 'login'     , component: LoginComponent                                },
  { path: 'logout'    , component: LogoutComponent                               },
  { path: 'editor'    , component: EditorComponent    , canActivate: [AuthGuard] },
  { path: 'share-note', component: ShareNoteComponent , canActivate: [AuthGuard] },
  { path: 'dashboard' , component: DashboardComponent , canActivate: [AuthGuard] },
  { path: 'profil'    , component: ProfilComponent    , canActivate: [AuthGuard] },
  { path: ''          , redirectTo: 'login'           , pathMatch: 'full'        },
  { path: '**'        , redirectTo: ''                                           } // must be the last route
];
