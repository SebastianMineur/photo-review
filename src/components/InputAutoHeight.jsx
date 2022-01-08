import { useEffect, useRef } from "react";
import styles from "./InputAutoHeight.module.css";

const InputAutoHeight = ({
  value = "",
  className = "",
  rows = "1",
  ...props
}) => {
  const titleRef = useRef();

  // Auto resize textarea to fit content
  const autoResize = () => {
    const textarea = titleRef.current;
    const compStyle = window.getComputedStyle(textarea);
    // Required for sizing down when content removed
    textarea.style.height = "auto";
    // Content height + border
    textarea.style.height =
      textarea.scrollHeight +
      parseInt(compStyle.getPropertyValue("border-top-width")) +
      parseInt(compStyle.getPropertyValue("border-bottom-width")) +
      "px";
  };

  useEffect(() => {
    window.addEventListener("resize", autoResize);
    return () => {
      window.removeEventListener("resize", autoResize);
    };
  }, []);

  useEffect(() => {
    if (!titleRef.current) return;
    // Remember selection position and re-apply after value is updated,
    // otherwise cursor snaps to end of input when changed
    const textarea = titleRef.current;
    const sel = textarea.selectionStart;
    // Set the value
    textarea.value = value;
    autoResize();
    // Re-apply selection, if element in focus
    if (textarea === document.activeElement) {
      textarea.selectionStart = sel;
    }
  }, [value]);

  return (
    <textarea
      className={styles.InputAutoHeight + " " + className}
      ref={titleRef}
      rows={rows}
      {...props}
    />
  );
};

export default InputAutoHeight;
