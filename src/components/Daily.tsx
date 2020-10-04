import React, { SetStateAction, useState } from "react";
import Weather from "../shared/models/Weather";
import "./Daily.css";
import ChartComponent, { Line } from "react-chartjs-2";
import Divisor from "../shared/components/Divisor";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";

interface ContainerProps {
  weatherData: Weather;
}

const Daily: React.FC<ContainerProps> = (props) => {
  const [section, setSection]: [string, SetStateAction<any>] = useState(
    "temperature"
  );

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
    labels: ["", ...days, ""],
    datasets: [
      {
        label: "Temp. mínima (ºC)",
        backgroundColor: "rgba(75,192,192,0.1)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: [null, ...min, null],
      },
      {
        label: "Temp. máxima (ºC)",
        backgroundColor: "rgba(255,99,132,0.1)",
        borderColor: "rgba(255,99,132,1)",

        borderWidth: 1,
        data: [null, ...max, null],
      },
    ],
  };

  const precData = {
    labels: ["", ...days, ""],
    datasets: [
      {
        label: "Probabilidad de precipitaciones (%)",
        backgroundColor: "rgba(75,192,192,0.1)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        data: [null, ...precipitationsProb, null],
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
            max: 105,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        align: (context: any) =>
          context.dataset.data[context.dataIndex] < 80 ? "end" : "start",
        anchor: (context: any) =>
          context.dataset.data[context.dataIndex] < 80 ? "end" : "start",
        backgroundColor: "rgba(75,192,192,.2)",
        color: "rgba(75,192,192,1)",
        borderRadius: 4,
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

      <IonSegment
        onIonChange={(e) => setSection(e.detail.value)}
        mode="ios"
        value={section}
        className="Daily__segment"
      >
        <IonSegmentButton value="temperature">
          <IonLabel>Temperatura</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="precipitations">
          <IonLabel>Precipitaciones</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {section === "temperature" ? (
        <div className="Daily__temp-div">
          <h5 className="Daily__section-header">Temperaturas</h5>

          <Line data={tempData} options={tempOptions} />
        </div>
      ) : (
        <div className="Daily__prec-div">
          <h5 className="Daily__section-header">
            Probabilidad de precipitaciones
          </h5>

          <Line data={precData} options={precOptions} />
        </div>
      )}
    </div>
  );
};

export default Daily;
