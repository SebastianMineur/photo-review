import { useState } from "react";
import styles from "./Photo.module.css";
import classes from "../util/classes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const Photo = ({ image, className, ...props }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={classes(styles.Photo, className)} {...props}>
      <div className={classes(styles.skeleton, !loading && "d-none")}>
        <FontAwesomeIcon icon={faImage} size="8x" />
      </div>

      <img
        src={image.url}
        className={classes(loading && "d-none")}
        onLoad={() => setLoading(false)}
      />

      {props.children}
    </div>
  );
};

export default Photo;
