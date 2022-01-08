import { useState, useRef, useEffect } from "react";
import styles from "./Photo.module.css";
import classes from "../util/classes";
import imageImg from "../assets/image.png";

const Photo = ({ image, onChange, className, ...props }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const imgRef = useRef();

  const handleChange = (value) => {
    setRating(value);
    onChange(value);
  };

  useEffect(() => {
    if (!imgRef.current) return;
    imgRef.current.addEventListener("load", () => {
      setLoading(false);
    });
  }, [loading]);

  return (
    <div className={classes(styles.Photo, className)} {...props}>
      {loading && (
        <img
          src={imageImg}
          className={classes(styles.skeleton, !loading && styles.hidden)}
        />
      )}

      <img
        ref={imgRef}
        src={image.url}
        className={classes(loading && styles.hidden)}
      />

      {onChange && (
        <div className={styles.ratings}>
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
