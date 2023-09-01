export class Review {
  constructor(
    private _id: number,
    private _userEmail: string,
    private _message: string,
    private _rating: number
  ) {}
  get id() {
    return this._id;
  }
  get rating() {
    return this._rating;
  }
  get userEmail() {
    return this._userEmail;
  }
  get message() {
    return this._message;
  }
}
