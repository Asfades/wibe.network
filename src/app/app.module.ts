import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    HeaderComponent,
    PlaylistComponent,
    PlaylistItemComponent
  ],
  imports: [
    BrowserModule,
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
