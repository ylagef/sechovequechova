import React, { SetStateAction, useState } from "react";
import Weather from "../shared/models/Weather";
import "./Daily.css";
import { Line } from "react-chartjs-2";
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
    precipitationsProb.push((props.weatherData.daily || {})[d].pop || 0);
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
        label: "daily_max",
        backgroundColor: "rgba(255,99,132,0.1)",
        borderColor: "rgba(255,99,132,1)",
        data: max,
      },
      {
        label: "daily",
        backgroundColor: "rgba(75,192,192,0.1)",
        borderColor: "rgba(75,192,192,1)",
        data: min,
      },
    ],
  };

  const precData = {
    labels: days,
    datasets: [
      {
        label: "daily",
        backgroundColor: "rgba(75,192,192,0.1)",
        borderColor: "rgba(75,192,192,1)",
        data: precipitationsProb,
      },
    ],
  };

  const maxMinOptions: any = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: Math.min(...min) - 5,
            max: Math.max(...max) + 5,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        align: (context: any, _: any) =>
          context.datasetIndex === 1 ? "start" : "end",
        anchor: (context: any, _: any) =>
          context.datasetIndex === 1 ? "start" : "end",
        color: (context: any, _: any) =>
          context.datasetIndex === 1
            ? "rgba(75,192,192,1)"
            : "rgba(255,99,132,1)",
        backgroundColor: (context: any, _: any) =>
          context.datasetIndex === 1
            ? "rgba(75,192,192,.2)"
            : "rgba(255,99,132,.2)",
        formatter: (value: string, _: any) => value + "º",
      },
    },
  };

  const precOptions: any = {
    scales: {
      yAxes: [
        {
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
        formatter: (value: string, _: any) => value + "%",
        display: (context: any) => context.dataset.data[context.dataIndex] > 0,
      },
    },
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
        <IonSegmentButton value="rains">
          <IonLabel>Precipitaciones</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {section === "temperature" ? (
        <div className="Daily__temp-div">
          <h5 className="Daily__section-header">
            Temperaturas
            <label className="Daily__section-header-label">(ºC)</label>
          </h5>

          <Line data={tempData} options={maxMinOptions} height={200} />
        </div>
      ) : (
        <div className="Daily__prec-div">
          <h5 className="Daily__section-header">
            Probabilidad de precipitaciones
            <label className="Daily__section-header-label">(%)</label>
          </h5>

          <Line data={precData} options={precOptions} height={200} />
        </div>
      )}
    </div>
  );
};

export default Daily;
