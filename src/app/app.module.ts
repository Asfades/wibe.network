import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MaterialModule } from './modules/material.module';
import { AppRoutingModule } from './modules/app-routing.module';
import { environment } from '../environments/environment';

import * as fromApp from './store/app.reducer';
import { AuthInterceptorService } from './pages/auth/auth-interceptor.service';
import { AuthEffects } from './pages/auth/store/auth.effects';
import { AuthComponent } from './pages/auth/auth.component'; // page
import { AppComponent } from './app.component';
import { PlayerComponent } from '@player/player.component';
import { HeaderComponent } from './components/header/header.component';
import { PlaylistComponent } from '@playlist/playlist.component';
import { PlaylistItemComponent } from '@playlist/playlist-item/playlist-item.component';
import { PlaylistEffects } from '@playlist/store/playlist.effects';
import { VisualiserComponent } from './components/visualiser/visualiser.component';
import { HomeComponent } from './pages/home/home.component';
import { UploadComponent } from './pages/upload/upload.component';
import { DropPlaceComponent } from './pages/upload/drop-place/drop-place.component';
import { UploadItemComponent } from './pages/upload/upload-item/upload-item.component'; // page

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    HeaderComponent,
    PlaylistComponent,
    PlaylistItemComponent,
    VisualiserComponent,
    AuthComponent,
    HomeComponent,
    UploadComponent,
    DropPlaceComponent,
    UploadItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot(fromApp.appReducer, { metaReducers: fromApp.metaReducers }),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forRoot([PlaylistEffects, AuthEffects]),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
