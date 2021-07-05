import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { AddCustomerComponent } from './components/add-customer/add-customer.component';
import { SearchComponent } from './components/search/search.component'

const routes: Routes = [
  { path: '', redirectTo: '/add', pathMatch: 'full'},
  { path: 'add', component: AddCustomerComponent},
  { path: 'search', component: SearchComponent},
  { path: 'list', component: CustomerListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
