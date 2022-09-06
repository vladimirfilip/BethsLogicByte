import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { getAuthInfo } from "../helpers/authHelper";
import { UsernameContext } from "../router";
import PropTypes from "prop-types";

function ProfilePicInput(props) {
  const [imgSrc, setImgSrc] = useState(null);
  const [showIncorrectImg, setShowIncorrectImg] = useState(false);
  const username = useContext(UsernameContext);
  const [isLoaded, setIsLoaded] = useState(false);

  const checkImgType = (imgFile) => {
    console.log(imgFile);
    if (imgFile.type != "image/png" && imgFile.type != "image/jpg") {
      setShowIncorrectImg(true);
    } else {
      setShowIncorrectImg(false);
      setImgSrc(URL.createObjectURL(imgFile));
      props.setProfilePic(URL.createObjectURL(imgFile));
    }
  };

  useEffect(() => {
    if (username) {
      axios
        .get(`http://127.0.0.1:8000/api_profiles/`, {
          headers: { Authorization: `token ${getAuthInfo().token}` },
          params: { username: username },
        })
        .then((response) => {
          axios
            .get(`http://127.0.0.1:8000/api_profile_picture/`, {
              headers: { Authorization: `token ${getAuthInfo().token}` },
              params: { id: response.data.id },
            })
            .then((response) => {
              setImgSrc(response.data.image);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [username]);

  useEffect(() => {
    if (imgSrc) {
      setIsLoaded(true);
    }
  }, [imgSrc]);

  if (isLoaded) {
    return (
      <>
        {showIncorrectImg && (
          <h2 color="red">Uploaded images must be PNG or JPEG</h2>
        )}
        <img src={imgSrc} />
        <input
          type="file"
          accept=".jpg,.png"
          onChange={(e) => {
            checkImgType(e.target.files[0]);
          }}
        />
      </>
    );
  } else {
    return <h2>Loading</h2>;
  }
}

ProfilePicInput.propTypes = {
  setProfilePic: PropTypes.func,
};
export default ProfilePicInput;
