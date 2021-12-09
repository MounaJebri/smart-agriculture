import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PostsComponent } from './modules/posts/posts.component';
import { TestComponent } from './modules/test/test.component';
import { LoginPageComponent } from './modules/login-page/login-page.component';
import { SignupPageComponent } from './modules/signup-page/signup-page.component'
import { NewpostsComponent } from './modules/newposts/newposts.component';
import { GetpostsComponent } from './modules/getposts/getposts.component';
import { TaskViewComponent } from './modules/task-view/task-view.component';
import { NewListComponent } from './modules/new-list/new-list.component';
import { NewTaskComponent } from './modules/new-task/new-task.component';
import { NodedataComponent } from './nodedata/nodedata.component';
const routes: Routes = [
 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
{ path: 'login', component: LoginPageComponent },
{ path: 'signup', component: SignupPageComponent },
//{ path: 'dashboard', component: DashboardComponent },
{path: '', component: DefaultComponent,
  children: 
  [ 
  {path: 'dashboard',component: DashboardComponent}, 
  {path: 'posts',component: PostsComponent}, 
  { path: 'lists', component: TaskViewComponent },
  { path: 'new-list', component: NewListComponent },
  { path: 'lists/:listId', component: TaskViewComponent },
  { path: 'lists/:listId/new-task', component: NewTaskComponent },
  {path: 'newposts',component: NewpostsComponent},
  {path: 'nodedata/:address/:Type',component: NodedataComponent}, 
  {path: 'test',component: TestComponent} ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: "reload"})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
