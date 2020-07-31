export class User {
  constructor(
    public username: string,
    public refreshToken: string,
    private _accessToken: string,
    private _tokenExpirationDate: Date,
    // public email: string,
    // public id: string,
    // private _token: string,
    // private _tokenExpirationDate: Date
  ) {}

  get accessToken(): string {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._accessToken;
  }
}
