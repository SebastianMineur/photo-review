import { useState, useRef, useEffect } from "react";
import styles from "./Photo.module.css";
import classes from "../util/classes";
import imageImg from "../assets/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

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
    <div
      className={classes(
        styles.Photo,
        rating < 0 && styles.down,
        rating > 0 && styles.up,
        className
      )}
      {...props}
    >
      <img
        src={imageImg}
        className={classes(styles.skeleton, !loading && styles.hidden)}
        aria-hidden
      />

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
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <button
            className={classes(
              styles.arrowButton,
              styles.up,
              rating > 0 && styles.active
            )}
            onClick={() => handleChange(1)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Photo;
