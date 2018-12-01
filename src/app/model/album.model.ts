import {Artist} from "./artist.model";
import {Track} from "./track.model";

export class Album {

  Id: number;
  Name: string;
  Artist: Artist;
  Tracks: Track[];
}
