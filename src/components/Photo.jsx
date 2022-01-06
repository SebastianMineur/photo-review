import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "./Photo.module.css";
import classes from "../util/classes";

const Photo = ({ path, onChange }) => {
  const [image, setImage] = useState();
  const [rating, setRating] = useState(0);

  useEffect(async () => {
    const snap = await getDoc(doc(db, path));
    setImage(snap.data());
  }, [path]);

  const handleChange = (value) => {
    setRating(value);
    onChange(value);
  };

  return (
    <div className={styles.Photo}>
      <img src={image?.url} />

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
