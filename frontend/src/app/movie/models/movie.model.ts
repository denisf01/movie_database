import { Genre } from './genre.model';
import { Review } from '../../review/models/review.model';

export class Movie {
  constructor(
    private _id: number,
    private _title: string,
    private _description: string,
    private _img_url: string,
    private _release_year: number,
    private _genres: Genre[],
    private _reviews: Review[] = []
  ) {}

  set id(id: number) {
    this._id = id;
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
  get rating_value(): number {
    let sum = 0;
    for (let rating of this._reviews) {
      sum += rating.rating;
    }
    return +(sum / this._reviews.length).toFixed(2) || 0;
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
