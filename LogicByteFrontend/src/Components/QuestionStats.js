import { Chart } from "react-google-charts";
import React, { useEffect, useState } from "react";
import { asyncGETAPI } from "../helpers/asyncBackend";
import CalendarHeatMap from "react-calendar-heatmap";
import "./QuestionStats.css";
import { Tooltip } from "react-tooltip";

function QuestionStats() {
  const [difficultyGraph, setDifficultyGraph] = useState(null);
  const [examGraph, setExamGraph] = useState(null);
  const [correctStat, setCorrectStat] = useState(null);
  const [activityStat, setActivityStat] = useState(null);

  const getQuestionData = async (questions) => {
    let ids = [];
    for (let question of questions) {
      ids.push(question.question);
    }
    ids = [...new Set(ids)];
    let questionData = await asyncGETAPI("api_questions", {
      ids: ids.join(","),
      s_difficulty: "",
      s_exam_type: "",
      s_id: "",
    });
    let qDifficulty = {};
    for (let question of questionData) {
      qDifficulty[question.id] = [question.difficulty, question.exam_type];
    }
    return qDifficulty;
  };

  const getQs = async () => {
    //
    // Gets data for attempted questions
    //
    let qData = await asyncGETAPI("api_solutions", {
      user_profile: "",
      s_question: "",
      s_date_modified: "",
      s_is_correct: "",
    });
    //
    // Stores the number of questions of each difficulty
    //
    let qDifficultyData = await getQuestionData(qData);
    let difficulties = { Easy: 0, Medium: 0, Hard: 0, Challenge: 0 };
    //
    // Stores number of correct questions
    //
    let num_correct = 0;
    let total_correct = 0;
    //
    // Stores date that the question was attempted
    //
    let dates = [];
    //
    // Stores number of questions attempted for each exam group
    //
    let exams = {};
    for (let question of qData) {
      difficulties[qDifficultyData[question.question][0]] += 1;
      if (question.is_correct) {
        num_correct += 1;
      }
      total_correct += 1;
      dates.push(question.date_modified);
      let exam = qDifficultyData[question.question][1];
      if (!Object.keys(exams).includes(exam)) {
        exams[exam] = 1;
      } else {
        exams[exam] += 1;
      }
    }
    //
    // Formats difficulty data for donut chart
    //
    let difficultyData = [
      ["Difficulty", "Number of questions attempted"],
      ["Easy", difficulties["Easy"]],
      ["Medium", difficulties["Medium"]],
      ["Hard", difficulties["Hard"]],
      ["Challenge", difficulties["Challenge"]],
    ];
    //
    // Formats exam data for column chart
    //
    let examData = [["Exam", "Number of questions attempted"]];
    for (let exam in exams) {
      examData.push([exam, exams[exam]]);
    }
    setExamGraph(
      <Chart
        chartType="ColumnChart"
        data={examData}
        width="100%"
        height="100%"
        options={{
          legend: { position: "none" },
          title: "Exam types of attempted questions",
        }}
      />
    );
    setDifficultyGraph(
      <Chart
        chartType="PieChart"
        data={difficultyData}
        width="100%"
        height="100%"
        options={{ title: "Difficulty of attempted questions", pieHole: 0.4 }}
      />
    );
    createCompleteStat(num_correct, total_correct);
    createActivityStat(dates);
  };

  const createActivityStat = (dates) => {
    //
    // Stores the number of questions answered per day
    //
    let dateFreq = {};
    for (let date of dates) {
      date = date.substring(0, 10);
      if (!Object.keys(dateFreq).includes(date)) {
        dateFreq[date] = 0;
      } else {
        dateFreq[date] += 1;
      }
    }
    //
    // Formats the date freq data for the calendar chart
    //
    let dateData = [];
    for (let date in dateFreq) {
      dateData.push({ date: date, count: dateFreq[date] });
    }
    //
    // Calculates date limits for the chart
    //
    let date = new Date();

    let endDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    date.setMonth(date.getMonth() - 4);
    let startDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    //
    // Heatmap that shows activity over past four months
    //
    setActivityStat(
      <div>
        <CalendarHeatMap
          startDate={startDate}
          endDate={endDate}
          values={dateData}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            }
            let count = value.count;
            if (count == 0) {
              return "color-empty";
            } else if (count < 10) {
              return "scale-1";
            } else if (count < 20) {
              return "scale-2";
            } else if (count < 30) {
              return "scale-3";
            } else if (count < 40) {
              return "scale-4";
            } else {
              return "scale-5";
            }
          }}
          tooltipDataAttrs={(value) => {
            if (value.count) {
              return {
                "data-tooltip-id": "my-tooltip",
                "data-tooltip-content": `Date: ${value.date}, number of questions attempted: ${value.count}`,
              };
            }
          }}
        />
        <Tooltip id="my-tooltip" />
      </div>
    );
  };

  useEffect(() => {
    console.log(difficultyGraph);
  }, [difficultyGraph]);

  const createCompleteStat = (numCorrect, totalCorrect) => {
    //
    // Calculate percentage of correct answers to 2dp
    //
    let percentage = Math.round((numCorrect / totalCorrect) * 10000) / 100;
    setCorrectStat(
      <div>
        <h5>Percentage of correct attempts</h5>
        <h1 className="percentage_stat">{`${percentage}%`}</h1>
      </div>
    );
  };

  useEffect(() => {
    getQs();
  }, []);

  return (
    <div className="graph_container">
      <div className="correct_stat">
        <span></span>
        <span>{correctStat}</span>
      </div>
      <div className="charts">
        <div className="graph">{difficultyGraph}</div>
        <div className="graph">{examGraph}</div>
      </div>
      <div>
        <h4 className="calendar_header">
          Number of attempted questions per day
        </h4>
        <div className="activity_stat">{activityStat}</div>
      </div>
    </div>
  );
}

export default QuestionStats;
