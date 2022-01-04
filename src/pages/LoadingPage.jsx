import Spinner from "../components/Spinner";
import styles from "./LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={styles.LoadingPage}>
      <Spinner />
    </div>
  );
};

export default LoadingPage;
