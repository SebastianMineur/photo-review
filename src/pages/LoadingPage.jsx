import Spinner from "../components/Spinner";
import styles from "./LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={`${styles.LoadingPage} text-primary`}>
      <Spinner size="100px" />
    </div>
  );
};

export default LoadingPage;
