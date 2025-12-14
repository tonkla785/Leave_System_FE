import { Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RequestFormComponent } from './component/request-form/request-form.component';
import { LeaveHistoryComponent } from './component/leave-history/leave-history.component';
import { ApproveRequestComponent } from './component/approve-request/approve-request.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard', component: DashboardComponent
    },
    {
        path: 'request-form', component: RequestFormComponent
    },
    {
        path: 'history', component: LeaveHistoryComponent
    },
    {
        path: 'approve-request', component: ApproveRequestComponent
    },
];
