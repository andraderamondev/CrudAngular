import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { ArtistComponent } from './artist/artist.component';
import { AlbumComponent } from './album/album.component';
import { TrackComponent } from './track/track.component';
import { GenreComponent } from './genre/genre.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'artist', component: ArtistComponent },
  { path: 'artist/add', component: ArtistComponent },
  { path: 'artist/:id', component: ArtistComponent },

  { path: 'album', component: AlbumComponent },
  { path: 'album/add', component: AlbumComponent },
  { path: 'album/:id', component: AlbumComponent },

  { path: 'track', component: TrackComponent },
  { path: 'track/add', component: TrackComponent },
  { path: 'track/:id', component: TrackComponent },

  { path: 'genre', component: GenreComponent },
  { path: 'genre/add', component: GenreComponent },
  { path: 'genre/:id', component: GenreComponent },
  {path : '', component : LoginComponent}
];

export const routing = RouterModule.forRoot(routes);
