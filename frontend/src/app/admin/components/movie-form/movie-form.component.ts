import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Genre } from '../../../movie/models/genre.model';
import { MovieService } from '../../../movie/services/movie.service';
import { Movie } from '../../../movie/models/movie.model';
import { BehaviorSubject } from 'rxjs';
import { AdminService } from '../../services/admin.service';

@Injectable()
class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    return `${date.getFullYear()}`;
  }
}

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'YYYY' },
        display: {
          dateInput: 'YYYY',
          monthYearLabel: 'YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY',
        },
      },
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieFormComponent implements OnInit {
  isEdit: boolean;
  id: number;
  open = new BehaviorSubject(true);
  get movie() {
    return this.movieService.getMovie(this.id);
  }
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  movieForm: FormGroup;
  genreList: Genre[] = [];

  ngOnInit() {
    this.movieForm = new FormGroup<any>({
      genres: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      releaseYear: new FormControl('', [Validators.required]),
      movieImg: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
    this.genreList = this.movieService.getGenres();
    this.isEdit = this.route.snapshot.url[0].path === 'edit';
    if (this.isEdit) {
      this.id = +this.route.snapshot.paramMap.get('id');
      this.loadMovie(this.id);
    }
    this.open.subscribe((value) => {
      if (!value) this.onClose();
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private movieService: MovieService,
    private adminService: AdminService
  ) {}

  onYearSelected(date: Date, datepicker: MatDatepicker<Date>) {
    const normalizedYear = date.getFullYear();
    this.movieForm.controls['releaseYear'].setValue(
      new Date(normalizedYear, 12, 0)
    );
    console.log(normalizedYear);
    datepicker.close();
  }

  onClose() {
    this.router.navigate(['movies']);
  }

  onSubmit() {
    if (this.isEdit) {
      this.adminService.editMovie(
        new Movie(
          this.id,
          this.movieForm.get('title').value,
          this.movieForm.get('description').value,
          this.movieForm.get('movieImg').value,
          this.movieForm.get('releaseYear').value.getFullYear(),
          this.movieForm.get('genres').value,
          this.movie.reviews
        )
      );
    } else {
      this.adminService.addMovie(
        new Movie(
          -1,
          this.movieForm.get('title').value,
          this.movieForm.get('description').value,

          this.movieForm.get('movieImg').value,
          this.movieForm.get('releaseYear').value.getFullYear(),
          this.movieForm.get('genres').value,
          []
        )
      );
    }
    this.onClose();
  }
  private loadMovie(id: number) {
    this.movieForm.controls['title'].setValue(this.movie.title);
    this.movieForm.controls['releaseYear'].setValue(
      new Date(this.movie.release_year, 12, 0)
    );
    this.movieForm.controls['movieImg'].setValue(this.movie.img_url);
    this.movieForm.controls['description'].setValue(this.movie.description);
    this.movieForm.controls['genres'].setValue(this.movie.genres);
  }
}
