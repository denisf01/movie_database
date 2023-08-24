import { Genre } from './genre.model';
import { Review } from '../../review/models/review.model';

export class Movie {
  constructor(
    private _id: number,
    private _title: string,
    private _description: string,
    private _rating_value: number,
    private _img_url: string,
    private _release_year: number,
    private _genres: Genre[],
    private _reviews: Review[] = []
  ) {}

  set rating(rating: number) {
    this._rating_value = rating;
  }

  get reviews() {
    return this._reviews;
  }
  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  get rating_value() {
    return this._rating_value;
  }
  get description() {
    return this._description;
  }
  get img_url() {
    return this._img_url;
  }
  get release_year() {
    return this._release_year;
  }
  get genres() {
    return this._genres.slice();
  }
}
