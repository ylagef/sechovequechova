import React from "react";
import "./Settings.css";
import { MdClose } from "react-icons/md";
import { IoMdSunny, IoMdMoon } from "react-icons/io";
import Card from "../shared/components/Card";
import Divisor from "../shared/components/Divisor";
import { IonSegment, IonSegmentButton } from "@ionic/react";
import { handleTheme } from "../shared/services/theming";

interface ContainerProps {
  setShowSettings: any;
  dataSource: string;
  handleDataSource: any;
  theme: string;
  setTheme: any;
}

const Settings: React.FC<ContainerProps> = (props) => {
  return (
    <div
      className="Settings"
      style={{ color: props.theme === "dark" ? "white" : "black" }}
    >
      <div className="Settings__top-div">
        <MdClose
          className="Settings__close-icon"
          onClick={() => props.setShowSettings(false)}
        />
      </div>

      <h1 className="Settings__title">Ajustes</h1>

      <Divisor />

      <Card>
        <h3 className="Settings__section-header">Tema</h3>

        <IonSegment
          onIonChange={(e) => {
            handleTheme(false, props.setTheme, e.detail.value);
          }}
          mode="ios"
          value={props.theme}
          className="Settings__segment"
        >
          <IonSegmentButton value="dark">
            <IoMdMoon className="Header__top-bar-theme" />
          </IonSegmentButton>
          <IonSegmentButton value="light">
            <IoMdSunny className="Header__top-bar-theme" />
          </IonSegmentButton>
        </IonSegment>
      </Card>

      <Card>
        <h3 className="Settings__section-header">Fuente de datos</h3>

        <IonSegment
          onIonChange={props.handleDataSource}
          mode="ios"
          value={props.dataSource}
          className="Settings__segment"
        >
          <IonSegmentButton value="aemet">
            <label>Aemet</label>
          </IonSegmentButton>
          <IonSegmentButton value="owm">
            <label>Openweathermap</label>
          </IonSegmentButton>
        </IonSegment>
      </Card>
    </div>
  );
};

export default Settings;
