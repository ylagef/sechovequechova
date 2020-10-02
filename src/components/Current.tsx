import React from "react";
import CountUp from "react-countup";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import { FiSunrise, FiSunset } from "react-icons/fi";
import Weather from "../shared/models/Weather";
import "./Current.css";
import Divisor from "../shared/components/Divisor";

interface ContainerProps {
  weatherData: Weather;
}

const Current: React.FC<ContainerProps> = (props) => {
  return (
    <div className="Current">
      <div className="Current__current-temperature">
        <div className="Current__current-temperature-max">
          <MdArrowUpward />
          <CountUp
            end={props.weatherData.current?.max || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="º"
          />
        </div>

        <div className="Current__current-temperature-current">
          <CountUp
            end={props.weatherData.current?.temperature || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="º"
          />
        </div>

        <div className="Current__current-temperature-min">
          <MdArrowDownward />
          <CountUp
            end={props.weatherData.current?.min || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="º"
          />
        </div>
      </div>

      <Divisor width={70} />

      <div className="Current__current-sun">
        <div className="Current__current-sun-sunrise">
          <FiSunrise />
          <div className="Current__current-sun-text">
            {props.weatherData.current?.sunrise}
          </div>
        </div>
        <div className="Current__current-sun-sunset">
          <div className="Current__current-sun-text">
            {props.weatherData.current?.sunset}
          </div>
          <FiSunset />
        </div>
      </div>
    </div>
  );
};

export default Current;
