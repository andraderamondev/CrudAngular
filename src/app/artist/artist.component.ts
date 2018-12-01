import { ChangeDetectorRef, Component, OnInit, OnDestroy,Input ,ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {ArtistService} from "../service/artist.service";
import {Artist} from "../model/artist.model";
import {MatPaginator, MatTableDataSource, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
	view: string;
	isEdit: boolean;
	action: string;
	artists: Artist[];
	displayedColumns: string[] = ['id', 'name', 'actions'];
	dataSource = new MatTableDataSource([])
	@Input() artist: Artist;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	addForm: FormGroup;

	constructor(private formBuilder: FormBuilder,private router: Router,private route: ActivatedRoute, private artistService: ArtistService,changeDetectorRef: ChangeDetectorRef, public snackBar: MatSnackBar,private location: Location) { 
        this.action = window.location.pathname;
        this.artist = new Artist;
    }

	ngOnInit() {
		if (this.action=='/artist') {
  			this.view = 'list'
  			this.artistService.getArtists()
				.subscribe( data => {
					this.artists = data.value
					this.dataSource = new MatTableDataSource(this.artists)
					this.dataSource.paginator = this.paginator
			});
  		}else{
  			const id = +this.route.snapshot.paramMap.get('id');
  			if(id>0){
	  			this.isEdit = true;
	  			this.getArtist(id);
  			}else{
  				this.isEdit = false;
  				this.addForm = this.formBuilder.group({
			    	id: [],
			      	name: ['', Validators.required]
			    });
  			}
  		}
	}

	applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    } 

	onSubmit() {
		if(this.addForm.value.name.trim()!=''){
	    this.artistService.createArtist(this.addForm.value)
	    	.subscribe( data => {
	        	this.router.navigate(['artist']);
	        	this.showMsg("Artist Save")
	      	});
	    }else{
	    	this.showMsg("Field required name");
	    }
	}

	getArtist(id: number): void {
	    this.artistService.getArtist(id).subscribe(artist => this.artist = artist);
	}

  	deleteArtist(artist: Artist): void {
    	var isTrue = confirm("Delete Artist?")
    	if(isTrue==true && artist!=null){
      		this.artistService.deleteArtist(artist.Id)
        	.subscribe( data => {
          		this.artists = this.artists.filter(u => u !== artist);
          		this.dataSource = new MatTableDataSource(this.artists)
          		this.dataSource.paginator = this.paginator
          		this.showMsg('Artist deleted')
        	})
    	}
  	};

  	editArtist(artist: Artist): void {
    	this.router.navigate([`artist/${artist.Id}`]);
  	};

  	addArtist(): void {
    	this.router.navigate(['artist/add']);
  	};

  	showMsg(msg :string) {
    	this.snackBar.open(msg, 'Close', {
      		duration: 3000
    	});
  	}

  	save(): void {
		if(this.artist.Name.trim()!=''){
	    	this.artistService.updateArtist(this.artist).subscribe(() => this.goBack());
	    	this.showMsg("Artist updated");
	    }else{
	    	this.showMsg("Field required name");
	    }
	}

	goBack(): void {
		this.location.back();
	}
}
