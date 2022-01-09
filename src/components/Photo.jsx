import { useState, useRef, useEffect } from "react";
import styles from "./Photo.module.css";
import classes from "../util/classes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const Photo = ({ image, rating, onChange, onDelete, className, ...props }) => {
  const [loading, setLoading] = useState(true);
  const imgRef = useRef();

  const handleChange = (value) => {
    onChange(value);
  };

  useEffect(() => {
    if (!imgRef.current) return;
    imgRef.current.addEventListener("load", () => {
      setLoading(false);
    });
  }, []);

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
        ref={imgRef}
        src={image.url}
        className={classes(loading && styles.hidden)}
      />

      {onChange && (
        <>
          <button
            className={classes(
              styles.rating,
              styles.down,
              rating < 0 && styles.active
            )}
            onClick={() => handleChange(-1)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <button
            className={classes(
              styles.rating,
              styles.up,
              rating > 0 && styles.active
            )}
            onClick={() => handleChange(1)}
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </>
      )}
      )}
    </div>
  );
};

export default Photo;
