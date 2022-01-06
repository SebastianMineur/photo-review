import { useDropzone } from "react-dropzone";
import styles from "./Dropzone.module.css";
import classes from "../util/classes";

const Dropzone = ({ onDrop, className, ...props }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={classes(
        styles.Dropzone,
        isDragActive && styles.active,
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <p className={styles.caption}>Drop files here, or click to select</p>
    </div>
  );
};

export default Dropzone;
