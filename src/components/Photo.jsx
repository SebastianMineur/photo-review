import { useState } from "react";
import styles from "./Photo.module.css";
import classes from "../util/classes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const Photo = ({ image, rating, onChange, onRemove, className, ...props }) => {
  const [loading, setLoading] = useState(true);

  const handleChange = (value) => {
    onChange(value);
  };

  return (
    <div
      className={classes(
        styles.Photo,
        rating < 0 && styles.down,
        rating > 0 && styles.up,
        className
      )}
      {...props}
    >
      <div className={classes(styles.skeleton, !loading && styles.hidden)}>
        <FontAwesomeIcon icon={faImage} size="8x" />
      </div>

      <img
        src={image.url}
        className={classes(loading && styles.hidden)}
        onLoad={() => setLoading(false)}
      />

      {onChange && (
        <>
          <button
            className={classes(
              styles.icon,
              styles.down,
              rating < 0 && styles.active
            )}
            onClick={() => handleChange(-1)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <button
            className={classes(
              styles.icon,
              styles.up,
              rating > 0 && styles.active
            )}
            onClick={() => handleChange(1)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </>
      )}

      {onRemove && (
        <button
          variant="danger"
          className={classes(styles.icon, styles.down)}
          onClick={onRemove}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
    </div>
  );
};

export default Photo;
