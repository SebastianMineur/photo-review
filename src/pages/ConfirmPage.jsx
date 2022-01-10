import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const ConfirmPage = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ marginTop: "10vh" }}
    >
      <FontAwesomeIcon icon={faCheck} size="8x" className="text-primary" />
      <h1>Thank you!</h1>
    </div>
  );
};

export default ConfirmPage;
