import React from "react";
import PropTypes from "prop-types";

function User(props) {
  return <h1>{props.argument}</h1>;
}

User.propTypes = {
  argument: PropTypes.string,
};

export default User;
