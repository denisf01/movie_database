export class User {
  constructor(
    private _id: number,
    private _email: string,
    private _password: string
  ) {}
  get id() {
    return this._id;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }
}
