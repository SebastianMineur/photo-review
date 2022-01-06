import styles from "./PhotoGrid.module.css";

const PhotoGrid = (props) => {
  return <div className={styles.PhotoGrid}>{props.children}</div>;
};

export default PhotoGrid;
