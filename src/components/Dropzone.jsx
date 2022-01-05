import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./Dropzone.module.css";

const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`${styles.Dropzone} ${isDragActive ? styles.active : ""}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className={styles.caption}>Drop files to upload ...</p>
      ) : (
        <p className={styles.caption}>Drag files here, or click to select</p>
      )}
    </div>
  );
};

export default Dropzone;
