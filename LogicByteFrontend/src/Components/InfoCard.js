import React from "react";
import PropTypes from "prop-types";
import "./InfoCard.css";

function InfoCard(props) {
  return (
    <div className="info_card">
      <h5>{props.date}</h5>
      <h2>{props.title}</h2>
      {props.description}
    </div>
  );
}

InfoCard.propTypes = {
  date: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.object,
};

export default InfoCard;
