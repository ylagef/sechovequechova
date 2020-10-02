import React from "react";
import "./Card.css";

interface ContainerProps {
  children: any;
}

const Card: React.FC<ContainerProps> = (props) => {
  return (
    <div className="Card">
      <div className="Card-inner">{props.children}</div>
    </div>
  );
};

export default Card;
