import React from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { Container } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Redirect } from "react-router-dom";
import Task from "../additional/Task";
import s from "../../styles/Table.module.css";
import Auth from "../additional/Auth";

class ScrumTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table: "detail",
      isLoaded: true,
      tasks: [],
      filterAscending: false,
      filter: "time",
      isOpenFilters: false,
      detailTask: null,
      isPopup: false,
    };

    this.tableChange = this.tableChange.bind(this);
    this.filter = this.filter.bind(this);
    this.setIsAsceding = this.setIsAsceding.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.detailView = this.detailView.bind(this);
  }

  componentDidMount() {
    fetch("/data/tasks.json")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState(
            {
              isLoaded: true,
              tasks: result[Auth.getUser()],
            },
            () => this.filter()
          );
        },
        (error) => {
          this.setState({
            isLoaded: false,
          });
        }
      );
    this.interval = setInterval(
      () =>
        fetch("/data/tasks.json")
          .then((res) => res.json())
          .then(
            (result) => {
              this.setState(
                {
                  isLoaded: true,
                  tasks: result.r_zaycev,
                },
                () => this.filter()
              );
            },
            (error) => {
              this.setState({
                isLoaded: false,
              });
            }
          ),
      360000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tableChange(tabName) {
    this.setState({ table: tabName });
  }

  filter(type = "time") {
    this.setState({ filter: type }, () => {
      let tasks = [];
      if (type === "time") {
        tasks = this.state.tasks.sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          return aDate - bDate;
        });
        console.log(tasks);
      }
      if (type === "title") {
        tasks = this.state.tasks.sort((a, b) => {
          if (a.title < b.title) return -1;
          if (a.title === b.title) return 0;
          if (a.title > b.title) return 1;
        });
      }
      if (type === "status") {
        tasks = this.state.tasks.sort((a, b) => {
          return a.status - b.status;
        });
      }
      if (type === "elapsed") {
        tasks = this.state.tasks.sort((a, b) => {
          return a.elapsed - b.elapsed;
        });
      }
      if (type === "planned") {
        tasks = this.state.tasks.sort((a, b) => {
          return a.planned - b.planned;
        });
      }
      if (type === "priority") {
        tasks = this.state.tasks.sort((a, b) => {
          return a.priority - b.priority;
        });
      }
      if (this.state.filterAscending === true) {
        this.setState({ tasks });
      } else {
        this.setState({ tasks: tasks.reverse() });
      }
    });
  }

  setIsAsceding(isAsceding) {
    this.setState({ filterAscending: isAsceding }, () =>
      this.filter(this.state.filter)
    );
  }

  handleClick(e) {
    this.setState({ isOpenFilters: e.currentTarget });
  }

  handleClose() {
    this.setState({ isOpenFilters: false });
  }

  detailView(id) {
    for (let i = 0; i < this.state.tasks.length; i++) {
      if (this.state.tasks[i].id === id) {
        this.setState({
          detailTask: this.state.tasks[i],
          isPopup: true,
        }); //на случай, если id будут перемешаны
      }
    }
  }

  render() {
    const { table, isLoaded, tasks } = this.state;
    if (!Auth.getUser()) {
      return <Redirect to="/" />;
    }
    if (!isLoaded) {
      return (
        <Button variant="contained" color="primary">
          Загрузка...
        </Button>
      );
    }
    if (table === "scrum")
      return (
        <React.Fragment>
          <Container maxSize="xl" style={{ marginBottom: "70px" }}>
            <h2 className={s.mainTitle} style={{textAlign: 'center'}}>SCRUM доска</h2>
            <span
              onClick={() => this.setIsAsceding(true)}
              className={`${s.filterSpan} ${
                this.state.filterAscending ? s.filterSpanSelected : null
              }`}
            >
              Возрастание
            </span>{" "}
            /{" "}
            <span
              onClick={() => this.setIsAsceding(false)}
              className={`${s.filterSpan} ${
                !this.state.filterAscending ? s.filterSpanSelected : null
              }`}
            >
              Убывание
            </span>
            <Button
              style={{ marginLeft: "20px" }}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              Открыть фильтры
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.isOpenFilters}
              keepMounted
              open={Boolean(this.state.isOpenFilters)}
              onClose={this.handleClose}
            >
              <MenuItem
                onClick={() => {
                  this.handleClose();
                  this.filter("time");
                }}
              >
                По времени
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.handleClose();
                  this.filter("title");
                }}
              >
                По именам
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.handleClose();
                  this.filter("priority");
                }}
              >
                По приоритету
              </MenuItem>
            </Menu>
            <div className={s.scrumMain}>
              <div className={s.scrumTab}>
                <h3>Планируемое</h3>
                {tasks.map((el, i) => {
                  if (el.status === "1") {
                    return (
                      <Task
                        id={el.id}
                        kind="scrum"
                        title={el.title}
                        date={el.date}
                        priority={el.priority}
                        planned={el.planned}
                        elapsed={el.elapsed}
                        detailView={this.detailView}
                      />
                    );
                  }
                })}
              </div>
              <div className={s.scrumTab}>
                <h3>В процессе</h3>
                {tasks.map((el, i) => {
                  if (el.status === "2") {
                    return (
                      <Task
                        id={el.id}
                        kind="scrum"
                        title={el.title}
                        date={el.date}
                        priority={el.priority}
                        planned={el.planned}
                        elapsed={el.elapsed}
                        detailView={this.detailView}
                      />
                    );
                  }
                })}
              </div>
              <div className={s.scrumTab}>
                <h3>Готово</h3>
                {tasks.map((el, i) => {
                  if (el.status === "3") {
                    return (
                      <Task
                        id={el.id}
                        kind="scrum"
                        title={el.title}
                        date={el.date}
                        priority={el.priority}
                        planned={el.planned}
                        elapsed={el.elapsed}
                        detailView={this.detailView}
                      />
                    );
                  }
                })}
              </div>
            </div>
            </Container>
            <BottomNavigation className={s.navigation}>
              <BottomNavigationAction
                label="Подробное описание"
                className={s.navigation_tab}
                showLabel
                onClick={() => this.tableChange("detail")}
              />
              <BottomNavigationAction
                label="Краткий вид"
                className={s.navigation_tab}
                showLabel
                onClick={() => this.tableChange("short")}
              />
              <BottomNavigationAction
                label="Scrum-таблица"
                className={s.navigation_tab}
                showLabel
                onClick={() => this.tableChange("scrum")}
              />
            </BottomNavigation>
            {this.state.isPopup ? (
            <div
              className={s.popup}
              onClick={() => this.setState({ isPopup: false })}
            >
              <Container
                maxWidth="sm"
                className={s.popup_container}
                onClick={(e) => e.stopPropagation()}
              >
                <Task
                  kind="popup"
                  title={this.state.detailTask.title}
                  descr={this.state.detailTask.description}
                  date={this.state.detailTask.date}
                  priority={this.state.detailTask.priority}
                  planned={this.state.detailTask.planned}
                  elapsed={this.state.detailTask.elapsed}
                  status={this.state.detailTask.status}
                />
              </Container>
            </div>
          ) : null}
        </React.Fragment>
      );
    if (table === "short")
      return (
        <React.Fragment>
          <Container maxSize="xl" style={{ marginBottom: "70px" }}>
            <h2 className={s.mainTitle}>Краткое описание задач</h2>
            <span
              onClick={() => this.setIsAsceding(true)}
              className={`${s.filterSpan} ${
                this.state.filterAscending ? s.filterSpanSelected : null
              }`}
            >
              Возрастание
            </span>{" "}
            /{" "}
            <span
              onClick={() => this.setIsAsceding(false)}
              className={`${s.filterSpan} ${
                !this.state.filterAscending ? s.filterSpanSelected : null
              }`}
            >
              Убывание
            </span>
            <Button
              style={{ marginLeft: "20px" }}
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={this.handleClick}
            >
              Открыть фильтры
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={this.state.isOpenFilters}
              keepMounted
              open={Boolean(this.state.isOpenFilters)}
              onClose={this.handleClose}
            >
              <MenuItem
                onClick={() => {
                  this.handleClose();
                  this.filter("time");
                }}
              >
                По времени
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.handleClose();
                  this.filter("title");
                }}
              >
                По именам
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.handleClose();
                  this.filter("status");
                }}
              >
                По статусу
              </MenuItem>
              <MenuItem
                onClick={() => {
                  this.handleClose();
                  this.filter("priority");
                }}
              >
                По приоритету
              </MenuItem>
            </Menu>
            {tasks.map((el) => (
              <Task
                id={el.id}
                kind="short"
                title={el.title}
                descr={el.description}
                date={el.date}
                priority={el.priority}
                planned={el.planned}
                elapsed={el.elapsed}
                status={el.status}
                detailView={this.detailView}
              />
            ))}
          </Container>
          <BottomNavigation className={s.navigation}>
            <BottomNavigationAction
              label="Подробное описание"
              className={s.navigation_tab}
              showLabel
              onClick={() => this.tableChange("detail")}
            />
            <BottomNavigationAction
              label="Краткий вид"
              className={s.navigation_tab}
              showLabel
              onClick={() => this.tableChange("short")}
            />
            <BottomNavigationAction
              label="Scrum-таблица"
              className={s.navigation_tab}
              showLabel
              onClick={() => this.tableChange("scrum")}
            />
          </BottomNavigation>
          {this.state.isPopup ? (
            <div
              className={s.popup}
              onClick={() => this.setState({ isPopup: false })}
            >
              <Container
                maxWidth="sm"
                className={s.popup_container}
                onClick={(e) => e.stopPropagation()}
              >
                <Task
                  kind="popup"
                  title={this.state.detailTask.title}
                  descr={this.state.detailTask.description}
                  date={this.state.detailTask.date}
                  priority={this.state.detailTask.priority}
                  planned={this.state.detailTask.planned}
                  elapsed={this.state.detailTask.elapsed}
                  status={this.state.detailTask.status}
                />
              </Container>
            </div>
          ) : null}
        </React.Fragment>
      );
    return (
      <React.Fragment>
        <Container maxSize="xl" style={{ marginBottom: "70px" }}>
          <h2 className={s.mainTitle}>Подробное описание задач</h2>
          <span
            onClick={() => this.setIsAsceding(true)}
            className={`${s.filterSpan} ${
              this.state.filterAscending ? s.filterSpanSelected : null
            }`}
          >
            Возрастание
          </span>{" "}
          /{" "}
          <span
            onClick={() => this.setIsAsceding(false)}
            className={`${s.filterSpan} ${
              !this.state.filterAscending ? s.filterSpanSelected : null
            }`}
          >
            Убывание
          </span>
          <Button
            style={{ marginLeft: "20px" }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            Открыть фильтры
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.isOpenFilters}
            keepMounted
            open={Boolean(this.state.isOpenFilters)}
            onClose={this.handleClose}
          >
            <MenuItem
              onClick={() => {
                this.handleClose();
                this.filter("time");
              }}
            >
              По времени
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.handleClose();
                this.filter("title");
              }}
            >
              По именам
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.handleClose();
                this.filter("status");
              }}
            >
              По статусу
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.handleClose();
                this.filter("elapsed");
              }}
            >
              По затраченному времени
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.handleClose();
                this.filter("planned");
              }}
            >
              По планируемому времени
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.handleClose();
                this.filter("priority");
              }}
            >
              По приоритету
            </MenuItem>
          </Menu>
          {tasks.map((el) => (
            <Task
              id={el.id}
              kind="detail"
              title={el.title}
              descr={el.description}
              date={el.date}
              priority={el.priority}
              planned={el.planned}
              elapsed={el.elapsed}
              status={el.status}
            />
          ))}
        </Container>
        <BottomNavigation className={s.navigation}>
          <BottomNavigationAction
            label="Подробное описание"
            className={s.navigation_tab}
            showLabel
            onClick={() => this.tableChange("detail")}
          />
          <BottomNavigationAction
            label="Краткий вид"
            className={s.navigation_tab}
            showLabel
            onClick={() => this.tableChange("short")}
          />
          <BottomNavigationAction
            label="Scrum-таблица"
            className={s.navigation_tab}
            showLabel
            onClick={() => this.tableChange("scrum")}
          />
        </BottomNavigation>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
  };
};

export default ScrumTable;
