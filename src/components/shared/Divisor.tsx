import React from "react";
import "./Divisor.css";

interface ContainerProps {
  width?: number;
}

const Divisor: React.FC<ContainerProps> = (props) => {
  return (
    <div
      className="Divisor"
      style={{ width: props.width ? props.width + "%" : "90%" }}
    ></div>
  );
};

export default Divisor;
