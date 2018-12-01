import { ChangeDetectorRef, Component, OnInit, OnDestroy, Input, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {GenreService} from "../service/genre.service";
import {Genre} from "../model/genre.model";
import {MatPaginator, MatTableDataSource, MatSnackBar} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {
	view: string;
	isEdit: boolean;
	action: string;
	genres: Genre[];
  	displayedColumns: string[] = ['id', 'name', 'actions'];
  	dataSource = new MatTableDataSource([])
  	@Input() genre: Genre;
  	@ViewChild(MatPaginator) paginator: MatPaginator;
  	addForm: FormGroup;

	constructor(private formBuilder: FormBuilder,private router: Router,private route: ActivatedRoute, private genreService: GenreService,changeDetectorRef: ChangeDetectorRef, public snackBar: MatSnackBar,private location: Location) { 
        this.action = window.location.pathname;
        this.genre = new Genre;
    }

  	ngOnInit() {
  		if (this.action=='/genre') {
  			this.view = 'list'
  			this.genreService.getGenres()
		      	.subscribe( data => {
		        	this.genres = data.value
		        	this.dataSource = new MatTableDataSource(this.genres)
		        	this.dataSource.paginator = this.paginator
		    });
  		}else{
  			const id = +this.route.snapshot.paramMap.get('id');
  			if(id>0){
	  			this.isEdit = true;
	  			this.getGenre(id);
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
	    	this.genreService.createGenre(this.addForm.value)
	    		.subscribe( data => {
		        	this.router.navigate(['genre']);
		        	this.showMsg("Genre Save")
	      	});
	    }else{
	    	this.showMsg("Field required name");
	    }
	}

	getGenre(id: number): void {
	    this.genreService.getGenre(id).subscribe(genre => this.genre = genre);
	}

	deleteGenre(genre: Genre): void {
	    var isTrue = confirm("Delete Genre?")
	    if(isTrue==true && genre!=null){
	      this.genreService.deleteGenre(genre.Id)
	        .subscribe( data => {
	          this.genres = this.genres.filter(u => u !== genre);
	          this.dataSource = new MatTableDataSource(this.genres)
	          this.dataSource.paginator = this.paginator
	          this.showMsg('Genre deleted')
	        })
	    }
	};

	editGenre(genre: Genre): void {
	    this.router.navigate([`genre/${genre.Id}`]);
	};

	addGenre(): void {
	    this.router.navigate(['genre/add']);
	};

	showMsg(msg :string) {
	    this.snackBar.open(msg, 'Close', {
	      duration: 3000
	    });
	}

	save(): void {
		if(this.genre.Name.trim()!=''){
	    	this.genreService.updateGenre(this.genre).subscribe(() => this.goBack());
	    	this.showMsg("Genre updated");
	    }else{
	    	this.showMsg("Field required name");
	    }
	}

	goBack(): void {
		this.location.back();
	}
}
