import React from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Auth from "../additional/Auth";
import s from "../../styles/Authorization.module.css";

class Autorization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWarning: false,
      login: "",
      password: "",
      isLoginRight: false,
      isPasswordRight: false,
      isLoaded: false,
      users: [],
      isLogin: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.isLoginPasswordRight = this.isLoginPasswordRight.bind(this);
  }

  componentDidMount() {
    fetch("/data/authorization.json")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            users: result.auth,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
          });
        }
      );
  }

  isLoginPasswordRight() {
    if (this.state.isLoginRight && this.state.isPasswordRight) {
      this.setState({ isLogin: true });
    } else {
      this.setState({ isLogin: false });
    }
  }

  handleChange(e) {
    if (e.target.id === "Login") {
      this.setState({ login: e.target.value });
    }
    if (e.target.id === "Password") {
      this.setState({ password: e.target.value });
    }
  }

  isSubmit() {
    const { users, login, password } = this.state;
    console.log(login);
    Auth.login(this.state.login);
    this.setState({ isLoginRight: false, isPasswordRight: false });
    for (let i = 0; i < users.length; i++) {
      if (login === users[i].login && password === users[i].password) {
        this.setState({ isLoginRight: true, isPasswordRight: true }, () => {
          this.isLoginPasswordRight();
        });
        break;
      }
    }
  }

  onSubmit() {
    if (this.state.isLogin === false) {
      this.setState({ isWarning: true });
    }
  }

  render() {
    if (!this.state.isLoaded) {
      <Button variant="contained" color="primary">
        Загрузка...
      </Button>;
    }
    return (
      <Container maxWidth="sm">
        <form className={s.main} noValidate autoComplete="off">
          <h3 className={s.AuthText}>Пожалуйста авторизуйтесь</h3>
          <TextField
            id="Login"
            label="Логин"
            margin="dense"
            value={this.state.login}
            onChange={(e) => this.handleChange(e)}
          />
          <TextField
            id="Password"
            label="пароль"
            margin="dense"
            value={this.state.password}
            onChange={(e) => this.handleChange(e)}
          />
          <Button
            variant="contained"
            color="primary"
            className={s.button}
            onClick={() => this.onSubmit()}
            onMouseOver={() => this.isSubmit()}
          >
            {this.state.isLogin ? (
              <Link to="/table" className={s.button_text}>
                Войти
              </Link>
            ) : (
              "Войти"
            )}
          </Button>
          {this.state.isWarning ? (
            <p className={s.warning}>Ошибка входа</p>
          ) : null}
        </form>
      </Container>
    );
  }
}

export default Autorization;
