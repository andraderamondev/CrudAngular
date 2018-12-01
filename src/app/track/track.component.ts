import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { TrackService } from "../service/track.service";
import { GenreService } from "../service/genre.service";
import { Genre} from "../model/genre.model";
import { Track} from "../model/track.model";
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
	view: string;
	isEdit: boolean;
	action: string;
    tracks: Track[];
    t: Track;
	idGenre: number;
    genres: Genre[];
  	displayedColumns: string[] = ['id' ,'name' ,'composer' ,'milliseconds' ,'genre' ,'actions' ];
  	dataSource = new MatTableDataSource([])
  	@Input() track: Track;
  	@ViewChild(MatPaginator) paginator: MatPaginator;
  	addForm: FormGroup;
  	
  	constructor(private formBuilder: FormBuilder,private router: Router,private route: ActivatedRoute, private trackService: TrackService,private genreService: GenreService,changeDetectorRef: ChangeDetectorRef, public snackBar: MatSnackBar,private location: Location) { 
        this.action = window.location.pathname;
        this.t = new Track;
        this.track = new Track;
    }

  	async ngOnInit() {
  		if (this.action=='/track') {
  			this.view = 'list'
  			this.trackService.getTracks()
		      	.subscribe( data => {
                    this.tracks = data.value;
                    this.dataSource = new MatTableDataSource(this.tracks);
                    this.dataSource.paginator = this.paginator;
		    });
  		}else{
  			const id = +this.route.snapshot.paramMap.get('id');
            this.genreService.getGenres()
                  .subscribe( data => {
                    this.genres = data.value;
            });
            if(id>0){
                this.isEdit = true;
                this.track = await this.getTrack(id);
                if(this.track['Genre@xdata.ref'] && this.track['Genre@xdata.ref'].length>5){
                    this.idGenre = +this.track['Genre@xdata.ref'].replace('Genre(','').replace(')','');
                }else{
                    this.idGenre = 0;
                }
            }else{
                this.isEdit = false;
    			this.addForm = this.formBuilder.group({
    		        id: [],
                    name: ['', Validators.required],
                    composer: ['', Validators.required],
                    milliseconds: ['', Validators.required],
    		      	genre: ['', Validators.required]
    		    });
  			}
  		}
	}

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    } 

    async onSubmit() {
        if(this.addForm.value.name.trim()!=''){
            this.t.Name = this.addForm.value.name;
            this.t.Composer = this.addForm.value.composer;
            this.t.Milliseconds = +this.addForm.value.milliseconds;
            this.t.Genre = await this.genreService.getGenrePromise(this.addForm.value.genre);
            this.trackService.createTrack(this.t)
                .subscribe( data => {
                this.router.navigate(['track']);
                this.showMsg("Track Save");
            });
        }else{
            this.showMsg("All fields required");
        }
    }

    getTrack(id: number){
        return this.trackService.getTrackPromise(id);
    }

    deleteTrack(track: Track): void {
        localStorage.setItem("trackId", track.Id.toString());
        var isTrue = confirm("Delete Track?")
        if(isTrue==true && track!=null){
            this.trackService.deleteTrack(track.Id)
                .subscribe( data => {
                this.tracks = this.tracks.filter(u => u !== track);
                this.dataSource = new MatTableDataSource(this.tracks)
                this.dataSource.paginator = this.paginator
                this.showMsg('Track deleted')
            })
        }
    };

    editTrack(track: Track): void {
        this.router.navigate([`track/${track.Id}`]);
    };

    addTrack(): void {
        this.router.navigate(['track/add']);
    };

    showMsg(msg :string) {
        this.snackBar.open(msg, 'Close', {
            duration: 3000
        });
    }

    async save() {
        if(this.track.Name.trim()!=''){
            var gen = new Genre;
            gen = await this.genreService.getGenrePromise(+this.track['Genre']);
            this.track.Genre = gen;
            this.trackService.updateTrack(this.track).subscribe(() => this.goBack());
            this.showMsg("Track updated");
        }else{
            this.showMsg("All fields required");
        }
    }

    goBack(): void {
        this.location.back();
    }
}
