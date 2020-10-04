import React from "react";
import Weather from "../shared/models/Weather";
import "./Hourly.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartComponent from "react-chartjs-2";
import Divisor from "../shared/components/Divisor";

interface ContainerProps {
  weatherData: Weather;
}

const Hourly: React.FC<ContainerProps> = (props) => {
  const hours = props.weatherData.hourly
    ? [
        ...Object.keys(props.weatherData.hourly)
          .sort()
          .filter((h) => h.length === 2 && +h >= new Date().getHours()),
        ...Object.keys(props.weatherData.hourly)
          .sort()
          .filter((h) => h.length === 2 && +h < new Date().getHours()),
      ].slice(0, 8)
    : [];

  const precipitations: number[] = [];
  hours.forEach((h) => {
    precipitations.push((props.weatherData.hourly || {})[h].precipitation || 0);
  });

  const temperatures: number[] = [];
  hours.forEach((h) => {
    temperatures.push((props.weatherData.hourly || {})[h].temperature || 0);
  });

  const tempData = {
    plugins: [ChartDataLabels],

    labels: hours.map((h) => h + "h"),
    datasets: [
      {
        fill: false,
        backgroundColor: "rgba(255,99,132,0.5)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        data: temperatures,
      },
    ],
  };

  const precData = {
    plugins: [ChartDataLabels],

    labels: hours.map((h) => h + "h"),
    datasets: [
      {
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: precipitations,
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
            min: Math.min.apply(Math, temperatures) - 5,
            max: Math.max.apply(Math, temperatures) + 5,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        align: "end",
        anchor: "end",
        backgroundColor: "rgba(255,99,132,.2)",
        borderRadius: 4,
        color: "rgba(255,99,132,1)",
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
            max: 1,
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
        formatter: (value: string, _: any) => value + "mm",
        display: (context: any) => context.dataset.data[context.dataIndex] > 0,
      },
    },
    legend: { display: false },
  };

  return (
    <div className="Hourly fade-in">
      <div className="Hourly__title">
        <h3 className="Hourly__title-h3">Predicción por horas</h3>
      </div>

      <div className="Hourly__temp-div">
        <h5 className="Hourly__section-header">Temperatura</h5>

        <ChartComponent
          type="line"
          data={tempData}
          width={500}
          options={tempOptions}
        />
      </div>

      <Divisor />

      <div className="Hourly__prec-div">
        <h5 className="Hourly__section-header">Precipitaciones</h5>

        <ChartComponent
          type="bar"
          data={precData}
          width={500}
          height={50}
          options={precOptions}
        />
      </div>
    </div>
  );
};

export default Hourly;
