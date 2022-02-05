import styles from "./Spinner.module.css";

const Spinner = ({ size = "1em" }) => {
  return <span style={{ "--size": size }} className={styles.Spinner}></span>;
};

export default Spinner;
