import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { MaterialModule } from './material.module';
import { environment } from '../environments/environment';

import * as fromApp from './store/app.reducer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from '@player/player.component';
import { HeaderComponent } from './components/header/header.component';
import { PlaylistComponent } from '@playlist/playlist.component';
import { PlaylistItemComponent } from '@playlist/playlist-item/playlist-item.component';
import { PlaylistEffects } from '@playlist/store/playlist.effects';
import { VisualiserComponent } from './components/visualiser/visualiser.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    HeaderComponent,
    PlaylistComponent,
    PlaylistItemComponent,
    VisualiserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    StoreModule.forRoot(fromApp.appReducer, { metaReducers: fromApp.metaReducers }),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    EffectsModule.forRoot([PlaylistEffects]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
