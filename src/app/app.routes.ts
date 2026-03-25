import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'chat/:id', component: ChatComponent },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent },
];
