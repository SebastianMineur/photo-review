import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styles from "./Photo.module.css";

const Photo = ({ id }) => {
  const [image, setImage] = useState();

  useEffect(async () => {
    const snap = await getDoc(doc(db, id));
    setImage(snap.data());
  }, [id]);

  return (
    <div className={styles.Photo}>
      <img src={image?.url} />
    </div>
  );
};

export default Photo;
