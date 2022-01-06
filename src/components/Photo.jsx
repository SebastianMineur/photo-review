import { useState } from "react";
import styles from "./Photo.module.css";
import classes from "../util/classes";

const Photo = ({ image, onChange }) => {
  const [rating, setRating] = useState(0);

  const handleChange = (value) => {
    setRating(value);
    onChange(value);
  };

  return (
    <div className={styles.Photo}>
      <img src={image.url} />

      {onChange && (
        <div className="d-flex justify-content-center">
          <button
            className={classes(
              styles.arrowButton,
              styles.down,
              rating < 0 && styles.active
            )}
            onClick={() => handleChange(-1)}
          >
            ▼
          </button>

          <button
            className={classes(
              styles.arrowButton,
              styles.up,
              rating > 0 && styles.active
            )}
            onClick={() => handleChange(1)}
          >
            ▲
          </button>
        </div>
      )}
    </div>
  );
};

export default Photo;
