import React from "react";
import Button from "@material-ui/core/Button";
import s from "../../styles/task.module.css";

class Task extends React.Component {
  constructor(props) {
    super(props);
  }

  rightPlannedAndElapsedFormat(time) {
    let days, minutes, humanityTime;
    if (time > 86400) {
      days = time / 86400;
      Math.floor(days);
      minutes = time - days * 86400;
    } else {
      minutes = time / 60;
    }
    minutes = Math.floor(minutes);
    humanityTime = days ? `${days} дней ${minutes} минут` : `${minutes} минут`;
    return humanityTime;
  }

  render() {
    console.log(this.props.title);
    const {
      kind,
      title,
      descr,
      date,
      priority,
      planned,
      elapsed,
      status,
    } = this.props;
    let priorityToString;
    switch (priority) {
      case "1": {
        priorityToString = "Низкий приоритет";
        break;
      }
      case "2":
        priorityToString = "Средний приоритет";
        break;
      case "3":
        priorityToString = "Высокий приоритет";
        break;
    }
    let statusToString;
    switch (status) {
      case "1":
        statusToString = "Планируется";
        break;
      case "2":
        statusToString = "В разработке";
        break;
      case "3":
        statusToString = "Готово";
        break;
    }
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timezone: "UTC",
    };
    const dateToDate = new Date(date).toLocaleString("ru", options);
    const humanityPlanned = this.rightPlannedAndElapsedFormat(planned);
    const humanityElapsed = this.rightPlannedAndElapsedFormat(elapsed);
    if (kind === "scrum") {
      return (
        <div
          className={s.main}
          onClick={() => this.props.detailView(this.props.id)}
        >
          <h3 className={s.main_title}>{title}</h3>
          <span>{dateToDate}</span>
          <div>
            <span className={s.main_spans}>Приоритет: {priorityToString}</span>
          </div>
        </div>
      );
    }
    if (kind === "short") {
      return (
        <div
          className={s.main}
          onClick={() => this.props.detailView(this.props.id)}
        >
          <h3 className={s.main_title}>{title}</h3>
          <span>{dateToDate}</span>
          <div>
            <span className={s.main_spans}>Приоритет: {priorityToString}</span>
            <span className={s.main_spans}>Статус: {statusToString}</span>
          </div>
        </div>
      );
    }
    if (kind === "popup") {
      return (
        <div
          className={s.mainPopup}
        >
          <div className={s.main__flex}>
            <h3 className={s.main_titlePopup}>{title}</h3>
            <span>{dateToDate}</span>
          </div>
          <div>
            <span className={s.main_spansPopup}>
              Планируемое время: {humanityPlanned}
            </span>
            <span className={s.main_spansPopup}>
              Затраченное время: {humanityElapsed}
            </span>
          </div>
          <p className={s.main_descr}>{descr}</p>
          <div>
            <span className={s.main_spansPopup}>
              Приоритет: {priorityToString}
            </span>
            <span className={s.main_spansPopup}>Статус: {statusToString}</span>
          </div>
        </div>
      );
    }
    return (
      <div className={s.main}>
        <div className={s.main__flex}>
          <h3 className={s.main_title}>{title}</h3>
          <span>{dateToDate}</span>
        </div>
        <div>
          <span className={s.main_spans}>
            Планируемое время: {humanityPlanned}
          </span>
          <span className={s.main_spans}>
            Затраченное время: {humanityElapsed}
          </span>
        </div>
        <p>{descr}</p>
        <div>
          <span className={s.main_spans}>Приоритет: {priorityToString}</span>
          <span className={s.main_spans}>Статус: {statusToString}</span>
        </div>
      </div>
    );
  }
}

export default Task;
