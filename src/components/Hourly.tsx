import React, { SetStateAction, useState } from "react";
import Weather from "../shared/models/Weather";
import "./Hourly.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ChartComponent, { Line } from "react-chartjs-2";
import Divisor from "../shared/components/Divisor";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

interface ContainerProps {
  weatherData: Weather;
}

const Hourly: React.FC<ContainerProps> = (props) => {
  const [section, setSection]: [string, SetStateAction<any>] = useState(
    "temperature"
  );

  const hours = props.weatherData.hourly
    ? [
        ...Object.keys(props.weatherData.hourly)
          .sort()
          .filter((h) => h.length === 2 && +h >= new Date().getHours()),
        ...Object.keys(props.weatherData.hourly)
          .sort()
          .filter((h) => h.length === 2 && +h < new Date().getHours()),
      ].slice(0, 9)
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

    labels: ["", ...hours.map((h) => h + "h"), ""],
    datasets: [
      {
        backgroundColor: "rgba(255,99,132,0.1)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        data: [null, ...temperatures, null],
      },
    ],
  };

  const precData = {
    labels: ["", ...hours.map((h) => h + "h"), ""],
    datasets: [
      {
        backgroundColor: "rgba(75,192,192,0.1)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: [null, ...precipitations, null],
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
            max:
              Math.max.apply(Math, precipitations) < 0.8
                ? Math.max.apply(Math, precipitations) + 0.2
                : 1,
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

      <IonSegment
        onIonChange={(e) => setSection(e.detail.value)}
        mode="ios"
        value={section}
        className="Hourly__segment"
      >
        <IonSegmentButton value="temperature">
          <IonLabel>Temperatura</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="precipitations">
          <IonLabel>Precipitaciones</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {section === "temperature" ? (
        <div className="Hourly__temp-div">
          <h5 className="Hourly__section-header">Temperatura</h5>

          <Line data={tempData} options={tempOptions} />
        </div>
      ) : (
        <div className="Hourly__prec-div">
          <h5 className="Hourly__section-header">Precipitaciones</h5>

          <Line data={precData} options={precOptions} />
        </div>
      )}
    </div>
  );
};

export default Hourly;
