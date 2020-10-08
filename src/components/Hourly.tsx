import React, { SetStateAction, useState } from "react";
import Weather from "../shared/models/Weather";
import "./Hourly.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Line } from "react-chartjs-2";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import { defaults } from "react-chartjs-2";

interface ContainerProps {
  weatherData: Weather;
}

const Hourly: React.FC<ContainerProps> = (props) => {
  defaults.line.scales.yAxes[0].display = false;
  defaults.line.scales.yAxes[0].type = "linear";

  defaults.global.plugins.datalabels.font.weight = "bold";
  defaults.global.plugins.datalabels.borderRadius = 4;
  defaults.global.plugins.datalabels.textAlign = "center";

  defaults.global.elements.line.borderWidth = 1;

  defaults.global.maintainAspectRatio = false;
  defaults.global.responsive = false;
  defaults.global.legend.display = false;

  const [section, setSection]: [string, SetStateAction<any>] = useState(
    "temperature"
  );

  const hours = props.weatherData.hourly
    ? [
        ...Object.keys(props.weatherData.hourly)
          .sort()
          .filter((h) => +h >= new Date().getHours()),
        ...Object.keys(props.weatherData.hourly)
          .sort()
          .filter((h) => +h < new Date().getHours()),
      ]
    : [];

  const rains: number[] = [];
  hours.forEach((h) => {
    rains.push((props.weatherData.hourly || {})[h].rain || 0);
  });

  const temperatures: number[] = [];
  hours.forEach((h) => {
    temperatures.push((props.weatherData.hourly || {})[h].temp || 0);
  });

  const pop: number[] = [];
  hours.forEach((h) => {
    pop.push((props.weatherData.hourly || {})[h].pop || 0);
  });

  const tempData = {
    plugins: [ChartDataLabels],
    labels: hours.map((h) => h + "h"),
    datasets: [
      {
        label: "hourly",
        backgroundColor: "rgba(255,99,132,0.1)",
        borderColor: "rgba(255,99,132,1)",
        data: temperatures,
      },
    ],
  };

  const rainData = {
    labels: hours.map((h) => h + "h"),
    datasets: [
      {
        label: "hourly",
        backgroundColor: "rgba(75,192,192,0.1)",
        borderColor: "rgba(75,192,192,1)",
        data: rains,
      },
    ],
  };

  const popData = {
    labels: hours.map((h) => h + "h"),
    datasets: [
      {
        label: "hourly",
        backgroundColor: "rgba(75,192,192,0.1)",
        borderColor: "rgba(75,192,192,1)",
        data: pop,
      },
    ],
  };

  const tempOptions: any = {
    scales: {
      yAxes: [
        {
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
        color: "rgba(255,99,132,1)",
        formatter: (value: string, _: any) => value + "º",
      },
    },
  };

  const rainOptions: any = {
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0,
            max:
              Math.max.apply(Math, rains) < 0.8 &&
              Math.max.apply(Math, rains) > 0
                ? Math.max.apply(Math, rains) + 0.2
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
        color: "rgba(75,192,192,1)",
        formatter: (value: string, _: any) => value,
        display: (context: any) => context.dataset.data[context.dataIndex] > 0,
      },
    },
  };

  const popOptions: any = {
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
        <IonSegmentButton value="rains">
          <IonLabel>Precipitaciones</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {section === "temperature" ? (
        <div className="Hourly__temp-div">
          <h5 className="Hourly__section-header">
            Temperatura
            <label className="Hourly__section-header-label">(ºC)</label>
          </h5>

          <div className="Hourly__chart-container">
            <Line
              data={tempData}
              options={tempOptions}
              width={1000}
              height={200}
            />
          </div>
        </div>
      ) : (
        <div className="Hourly__prec-div">
          <h5 className="Hourly__section-header">
            Precipitaciones
            {props.weatherData.hourly?.prec ? (
              <label className="Hourly__section-header-label">(mm)</label>
            ) : (
              <label className="Hourly__section-header-label">(%)</label>
            )}
          </h5>
          <div className="Hourly__chart-container">
            {props.weatherData.hourly?.prec ? (
              <Line
                data={rainData}
                options={rainOptions}
                width={1000}
                height={200}
              />
            ) : (
              <Line
                data={popData}
                options={popOptions}
                width={1000}
                height={200}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hourly;
