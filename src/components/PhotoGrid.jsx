import styles from "./PhotoGrid.module.css";
import classes from "../util/classes";

const PhotoGrid = ({ children, className, ...props }) => {
  return (
    <div {...props} className={classes(styles.PhotoGrid, className)}>
      {children}
    </div>
  );
};

export default PhotoGrid;
