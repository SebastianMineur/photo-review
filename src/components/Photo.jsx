import { useState } from "react";
import styles from "./Photo.module.css";
import classes from "../util/classes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const Photo = ({ image, rating, onChange, onRemove, className, ...props }) => {
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

      {onChange && (
        <>
          <button
            className={classes(styles.icon, rating < 0 && "text-danger")}
            onClick={() => onChange(-1)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <button
            className={classes(styles.icon, rating > 0 && "text-success")}
            onClick={() => onChange(1)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </>
      )}

      {onRemove && (
        <button
          variant="danger"
          className={classes(styles.icon, "text-danger")}
          onClick={onRemove}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};

export default Photo;
