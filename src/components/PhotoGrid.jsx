import styles from "./PhotoGrid.module.css";
import classes from "../util/classes";
import { SRLWrapper } from "simple-react-lightbox";

const PhotoGrid = ({ children, className, ...props }) => {
  return (
    <SRLWrapper>
      <div {...props} className={classes(styles.PhotoGrid, className)}>
        {children}
      </div>
    </SRLWrapper>
  );
};

export default PhotoGrid;
