import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input, ViewChild, NgModule } from '@angular/core';
import { Router } from "@angular/router";
import { AlbumService } from "../service/album.service";
import { ArtistService } from "../service/artist.service";
import { Track } from "../model/track.model";
import { Album } from "../model/album.model";
import { Artist } from "../model/artist.model";
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})

export class AlbumComponent implements OnInit {
  	view: string;
	isEdit: boolean;
	action: string;
	albums: Album[];
    a: Album;
    idArtist: number;
    artists: Artist[];
  	displayedColumns: string[] = ['id' ,'name' ,'artist' ,'tracks' ,'actions' ];
  	dataSource = new MatTableDataSource([])
  	@Input() album: Album;
  	@ViewChild(MatPaginator) paginator: MatPaginator;
  	addForm: FormGroup;
  	
    constructor(private formBuilder: FormBuilder,private router: Router,private route: ActivatedRoute, private albumService: AlbumService,private artistService: ArtistService,changeDetectorRef: ChangeDetectorRef, public snackBar: MatSnackBar,private location: Location) { 
        this.action = window.location.pathname;
        this.album = new Album;
        this.a = new Album;
    }

    async ngOnInit() {
  		if (this.action=='/album') {
  			this.view = 'list'
  			this.albumService.getAlbums()
		      	.subscribe( data => {
		        	this.albums = data.value
		        	this.dataSource = new MatTableDataSource(this.albums)
		        	this.dataSource.paginator = this.paginator
		    });
  		}else{
  			const id = +this.route.snapshot.paramMap.get('id');
            this.artistService.getArtists()
                .subscribe( data => {
                this.artists = data.value;
            });
  			if(id>0){
	  			this.isEdit = true;
	  			this.album = await this.getAlbum(id);
                if(this.album['Artist@xdata.ref'] && this.album['Artist@xdata.ref'].length>5){
                    this.idArtist = +this.album['Artist@xdata.ref'].replace('Artist(','').replace(')','');
                }else{
                    this.idArtist = 0;
                }
  			}else{
  				this.isEdit = false;
  				this.addForm = this.formBuilder.group({
			    	id: [],
                    name: ['', Validators.required],
                    artist: ['', Validators.required]
			    });
  			}
  		}
	}

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }    

    async onSubmit() {
        if(this.addForm.value.name.trim()!=''){
            this.a.Name = this.addForm.value.name;
            this.a.Artist = await this.artistService.getArtistPromise(this.addForm.value.artist);
            this.albumService.createAlbum(this.a)
                .subscribe( data => {
                this.router.navigate(['album']);
                this.showMsg("Album Save")
            });
        }else{
            this.showMsg("All fields required");
        }
    }

    getAlbum(id: number){
        return this.albumService.getAlbumPromise(id);;
    }

    deleteAlbum(album: Album): void {
        var isTrue = confirm("Delete Album?")
        if(isTrue==true && album!=null){
            this.albumService.deleteAlbum(album.Id)
                .subscribe( data => {
                this.albums = this.albums.filter(u => u !== album);
                this.dataSource = new MatTableDataSource(this.albums)
                this.dataSource.paginator = this.paginator
                this.showMsg('Album deleted')
            })
        }
    };

    editAlbum(album: Album): void {
        this.router.navigate([`album/${album.Id}`]);
    };

    addAlbum(): void {
        this.router.navigate(['album/add']);
    };

    showMsg(msg :string) {
        this.snackBar.open(msg, 'Close', {
            duration: 3000
        });
    }

    async save(){
        if(this.album.Name.trim()!=''){
            var art = new Artist;
            art = await this.artistService.getArtistPromise(+this.album['Artist']);
            this.album.Artist = art;
            this.albumService.updateAlbum(this.album).subscribe(() => this.goBack());
            this.showMsg("Album updated");
        }else{
            this.showMsg("All fields required");
        }
    }

    goBack(): void {
        this.location.back();
    }
}
