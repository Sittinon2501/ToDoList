import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http'; // นำเข้า provideHttpClient และ withFetch
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TasksComponent } from './tasks/tasks.component';
import { TeamsComponent } from './teams/teams.component';
import { HistoryComponent } from './history/history.component';
import { UserGuideComponent } from './user-guide/user-guide.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, TasksComponent, TeamsComponent, HistoryComponent, UserGuideComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, DragDropModule],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()), // ใช้ provideHttpClient พร้อม withFetch สำหรับ fetch API
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
