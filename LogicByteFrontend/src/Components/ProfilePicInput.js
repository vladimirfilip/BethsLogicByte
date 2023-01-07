import React, { useEffect, useState, useContext } from "react";
import { UsernameContext } from "../router";
import PropTypes from "prop-types";
import { asyncGETAPI } from "../helpers/asyncBackend";

function ProfilePicInput(props) {
  const [imgSrc, setImgSrc] = useState(null);
  const [showIncorrectImg, setShowIncorrectImg] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const username = useContext(UsernameContext);

  const checkImgType = (imgFile) => {
    if (imgFile.type != "image/png" && imgFile.type != "image/jpeg") {
      setShowIncorrectImg(true);
    } else {
      setShowIncorrectImg(false);
      if (URL.createObjectURL(imgFile) != imgSrc) {
        setImgSrc(URL.createObjectURL(imgFile));
        props.setProfilePic(imgFile);
      }
    }
  };

  useEffect(() => {
    if (username) {
      (async () => {
        const pic_src = await asyncGETAPI("api_profile_picture", {
          user_profile: "",
        });
        setImgSrc(pic_src.image);
      })();
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
        <form>
          <input
            type="file"
            accept=".jpg,.png"
            onChange={(e) => {
              checkImgType(e.target.files[0]);
            }}
          />
        </form>
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
