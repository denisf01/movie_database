export class Genre {
  constructor(private _name: string) {}
  get name() {
    return this._name.substring(0, 1).toUpperCase() + this._name.substring(1);
  }
}
