import { useDropzone } from "react-dropzone";
import styles from "./Dropzone.module.css";
import classes from "../util/classes";
import albumImg from "../assets/album.png";

const Dropzone = ({ onDrop, className, ...props }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...props}
      {...getRootProps()}
      className={classes(
        styles.Dropzone,
        isDragActive && styles.active,
        className
      )}
    >
      <input {...getInputProps()} />
      <img src={albumImg} />
      <p className={styles.caption}>Drop files here, or click to select</p>
    </div>
  );
};

export default Dropzone;
