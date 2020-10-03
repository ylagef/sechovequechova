import React from "react";
import CountUp from "react-countup";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import {
  FiSunrise,
  FiSunset,
  FiDroplet,
  FiWind,
  FiCompass,
} from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";
import { FaSun } from "react-icons/fa";
import Weather from "../shared/models/Weather";
import "./Current.css";
import Divisor from "../shared/components/Divisor";

interface ContainerProps {
  weatherData: Weather;
}

const Current: React.FC<ContainerProps> = (props) => {
  return (
    <div className="Current">
      <div className="Current__temperature">
        <div className="Current__icon-div">
          <FaSun className="Current__icon" />
        </div>

        <div className="Current__temperature-max">
          <MdArrowUpward />
          <CountUp
            end={props.weatherData.current?.max || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="º"
          />
        </div>

        <div className="Current__temperature-current">
          <CountUp
            end={props.weatherData.current?.temperature || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="º"
          />
        </div>

        <div className="Current__temperature-min">
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

      <div className="Current__feels-like">
        <CountUp
          end={props.weatherData.current?.feelsLike || 0}
          duration={1}
          decimals={0}
          preserveValue={true}
          suffix="º"
          prefix="Sensación de "
        />
      </div>

      <Divisor width={70} />

      <div className="Current__rain-humidity">
        <div className="Current__rain">
          <FiDroplet className="Current__rain-icon" />
          <CountUp
            end={props.weatherData.current?.rain || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="mm"
          />
        </div>
        <div className="Current__humidity">
          <CountUp
            end={props.weatherData.current?.humidity || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="%"
          />
          <WiHumidity className="Current__humidity-icon" />
        </div>
      </div>

      <Divisor width={70} />

      <div className="Current__windSpeed-windDirection">
        <div className="Current__windSpeed">
          <FiWind className="Current__windSpeed-icon" />
          <CountUp
            end={props.weatherData.current?.windSpeed || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="km/h"
          />
        </div>
        <div className="Current__windDirection">
          <div>{props.weatherData.current?.windDirection}</div>
          <FiCompass className="Current__windDirection-icon" />
        </div>
      </div>

      <Divisor width={70} />

      <div className="Current__sun">
        <div className="Current__sun-sunrise">
          <FiSunrise />
          <div className="Current__sun-text">
            {props.weatherData.current?.sunrise}
          </div>
        </div>
        <div className="Current__sun-sunset">
          <div className="Current__sun-text">
            {props.weatherData.current?.sunset}
          </div>
          <FiSunset />
        </div>
      </div>
    </div>
  );
};

export default Current;
