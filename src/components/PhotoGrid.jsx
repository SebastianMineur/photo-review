import styles from "./PhotoGrid.module.css";
import { SRLWrapper } from "simple-react-lightbox";
import Masonry from "react-masonry-css";

const breakpointColumns = {
  default: 3,
  1200: 2,
  768: 1,
};

const PhotoGrid = ({ children }) => {
  return (
    <SRLWrapper>
      <Masonry
        className={styles.PhotoGrid}
        breakpointCols={breakpointColumns}
        columnClassName={styles.column}
      >
        {children}
      </Masonry>
    </SRLWrapper>
  );
};

export default PhotoGrid;
