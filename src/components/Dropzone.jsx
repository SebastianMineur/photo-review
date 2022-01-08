import { useDropzone } from "react-dropzone";
import styles from "./Dropzone.module.css";
import classes from "../util/classes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

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
      <FontAwesomeIcon icon={faImages} size="4x" />
      <p className={styles.caption}>Drop files here, or click to select</p>
    </div>
  );
};

export default Dropzone;
