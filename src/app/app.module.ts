import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  MatDatepickerModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatTabsModule,
  MatStepperModule,
  MatOptionModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatCheckboxModule,
  MatTableModule,
  MatDialogModule,
  MatPaginatorModule,
  MatToolbarModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatRippleModule,
  MatListModule,
  MatLineModule,
  MatMenuModule,
  MatBottomSheetModule,
  MatExpansionModule,
  MatDividerModule,
  MatPaginatorIntl,
  MAT_DATE_LOCALE,
  MatNativeDateModule
} from "@angular/material";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashComponent } from './pages/dash/dash.component';
import { GraphicComponent } from './components/graphic/graphic.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StateComponent } from './components/state/state.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ToastrModule } from "ngx-toastr";
import { TableDetailsComponent } from './components/table-details/table-details.component';

@NgModule({
  declarations: [
    AppComponent,
    DashComponent,
    GraphicComponent,
    StateComponent,
    LoadingComponent,
    TableDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true
    }),

    // Material
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatChipsModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatRippleModule,
    MatListModule,
    MatLineModule,
    MatMenuModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatDividerModule
  ],
  providers: [MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
