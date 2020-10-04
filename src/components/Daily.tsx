import React from "react";
import Weather from "../shared/models/Weather";
import "./Daily.css";
import ChartComponent from "react-chartjs-2";
import Divisor from "../shared/components/Divisor";

interface ContainerProps {
  weatherData: Weather;
}

const Daily: React.FC<ContainerProps> = (props) => {
  const days = props.weatherData.daily
    ? Object.keys(props.weatherData.daily)
    : [];

  const precipitationsProb: number[] = [];
  days.forEach((d) => {
    precipitationsProb.push(
      (props.weatherData.daily || {})[d].precipitationProb || 0
    );
  });

  const min: number[] = [];
  days.forEach((d) => {
    min.push((props.weatherData.daily || {})[d].min || 0);
  });
  const max: number[] = [];
  days.forEach((d) => {
    max.push((props.weatherData.daily || {})[d].max || 0);
  });

  const tempData = {
    labels: days,
    datasets: [
      {
        label: "Temp. mínima (ºC)",
        fill: false,
        backgroundColor: "rgba(75,192,192,0.5)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: min,
      },
      {
        label: "Temp. máxima (ºC)",
        fill: false,
        backgroundColor: "rgba(255,99,132,0.5)",
        borderColor: "rgba(255,99,132,1)",

        borderWidth: 1,
        data: max,
      },
    ],
  };

  const precData = {
    labels: days,
    datasets: [
      {
        label: "Probabilidad de precipitaciones (%)",
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: precipitationsProb,
      },
    ],
  };

  const tempOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          type: "linear",
          display: false,
          ticks: {
            min: Math.min.apply(Math, min) - 5,
            max: Math.max.apply(Math, max) + 5,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        align: (context: any, _: any) =>
          context.datasetIndex === 0 ? "start" : "end",
        anchor: (context: any, _: any) =>
          context.datasetIndex === 0 ? "start" : "end",
        color: (context: any, _: any) =>
          context.datasetIndex === 0
            ? "rgba(75,192,192,1)"
            : "rgba(255,99,132,1)",
        backgroundColor: (context: any, _: any) =>
          context.datasetIndex === 0
            ? "rgba(75,192,192,.2)"
            : "rgba(255,99,132,.2)",
        borderRadius: 4,
        font: {
          weight: "bold",
        },
        formatter: (value: string, _: any) => value + "º",
      },
    },
    legend: { display: false },
  };

  const precOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          type: "linear",
          display: false,
          ticks: {
            min: 0,
            max: 100,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        align: "end",
        anchor: "end",
        backgroundColor: "rgba(75,192,192,.2)",
        borderRadius: 4,
        color: "rgba(75,192,192,1)",
        font: {
          weight: "bold",
        },
        formatter: (value: string, _: any) => value + "%",
        display: (context: any) => context.dataset.data[context.dataIndex] > 0,
      },
    },
    legend: { display: false },
  };

  return (
    <div className="Daily fade-in">
      <div className="Daily__title">
        <h3 className="Daily__title-h3">Predicción por días</h3>
      </div>

      <div className="Daily__temp-div">
        <h5 className="Daily__section-header">Temperaturas</h5>

        <ChartComponent
          type="line"
          data={tempData}
          height={100}
          options={tempOptions}
        />
      </div>

      <Divisor />

      <div className="Daily__prec-div">
        <h5 className="Daily__section-header">
          Probabilidad de precipitaciones
        </h5>

        <ChartComponent
          type="bar"
          data={precData}
          height={100}
          options={precOptions}
        />
      </div>
    </div>
  );
};

export default Daily;
