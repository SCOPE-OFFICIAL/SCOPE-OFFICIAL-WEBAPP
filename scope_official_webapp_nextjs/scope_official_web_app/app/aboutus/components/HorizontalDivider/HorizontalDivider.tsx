import React from "react";
import styles from "./HorizontalDivider.module.css";

interface HorizontalDividerProps {
  marginTop?: string;
  marginBottom?: string;
}

const HorizontalDivider: React.FC<HorizontalDividerProps> = ({
  marginTop,
  marginBottom,
}) => {
  const inlineStyle = {
    marginTop: marginTop || "0",
    marginBottom: marginBottom || "0",
  };

  return <div className={styles.divider} style={inlineStyle}></div>;
};

export default HorizontalDivider;
