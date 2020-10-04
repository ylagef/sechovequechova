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
import { FaSun, FaCloudRain, FaMoon, FaCloud } from "react-icons/fa";
import Weather from "../shared/models/Weather";
import "./Current.css";
import Divisor from "../shared/components/Divisor";

interface ContainerProps {
  weatherData: Weather;
}

const Current: React.FC<ContainerProps> = (props) => {
  const sunriseHour = +(props.weatherData.current?.sunrise?.split(":")[0] || 7);
  const sunsetHour = +(props.weatherData.current?.sunset?.split(":")[0] || 21);

  return (
    <div className="Current fade-in">
      <div className="Current__temperature">
        <div className="Current__sky-icon">
          {props.weatherData.current?.sky?.icon === "rain" ? (
            <FaCloudRain className="Current__icon" />
          ) : props.weatherData.current?.sky?.icon === "cloud" ? (
            <FaCloud className="Current__icon" />
          ) : new Date().getHours() <= sunriseHour ||
            new Date().getHours() >= sunsetHour ? (
            <FaMoon className="Current__icon" />
          ) : (
            <FaSun className="Current__icon" />
          )}
        </div>

        <div className="Current__temperature-max">
          <MdArrowUpward />
          <CountUp
            end={props.weatherData.current?.max || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="º"
            className="Current__temperature-value"
          />
        </div>

        <div className="Current__temperature-current">
          <CountUp
            end={props.weatherData.current?.temperature || 0}
            duration={1}
            decimals={0}
            preserveValue={true}
            suffix="º"
            className="Current__temperature-value"
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
            className="Current__temperature-value"
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
          className="Current__temperature-value"
        />
      </div>

      {props.weatherData.current?.sky?.text && (
        <div className="Current__sky-text">
          {props.weatherData.current?.sky?.text}
        </div>
      )}

      <Divisor width={70} />

      <div className="Current__rain-humidity">
        <div className="Current__rain">
          <FiDroplet className="Current__rain-icon" />
          <CountUp
            end={props.weatherData.current?.rain || 0}
            duration={1}
            decimals={1}
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
