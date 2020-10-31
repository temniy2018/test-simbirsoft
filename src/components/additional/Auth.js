class Auth {
  constructor() {
    this.user = null;
  }

  login(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}

export default new Auth();
