import React from "react";
import "./Divisor.css";

interface ContainerProps {
  width?: number;
  borderWidth?: number;
}

const Divisor: React.FC<ContainerProps> = (props) => {
  return (
    <div className="Divisor">
      <div
        className="Divisor__inner"
        style={{
          width: props.width ? props.width + "%" : "90%",
          borderWidth: props.borderWidth ? props.borderWidth + "px" : "1px",
        }}
      ></div>
    </div>
  );
};

export default Divisor;
