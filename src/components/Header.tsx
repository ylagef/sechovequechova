import React, { SetStateAction, useState } from "react";
import "./Header.css";
import { IonHeader, IonModal, IonToolbar } from "@ionic/react";
import { IoMdSettings } from "react-icons/io";
import { MdLocationOn, MdClose, MdSearch } from "react-icons/md";
import Weather from "../shared/models/Weather";
import Settings from "./Settings";

interface ContainerProps {
  weatherData: Weather;
  searching: boolean;
  setSearching: any;
  dataSource: string;
  handleDataSource: any;
  theme: string;
  setTheme: any;
}

const Header: React.FC<ContainerProps> = (props) => {
  const [showSettings, setShowSettings]: [
    boolean,
    SetStateAction<any>
  ] = useState(false);

  return (
    <div className="Header">
      <IonHeader>
        <IonToolbar>
          <div className="Header__top-bar">
            <div className="Header__top-bar-city">
              {props.weatherData.city && (
                <div className="Header__top-bar-city-inner">
                  <MdLocationOn />
                  <div className="Header__top-bar-city-name">
                    {props.weatherData.city.name}
                  </div>
                </div>
              )}
            </div>

            <IoMdSettings
              className="Header__top-bar-settings"
              onClick={() => setShowSettings(true)}
            />

            {props.searching ? (
              <div className="Header__top-bar-cancel">
                {props.weatherData.city && (
                  <MdClose onClick={() => props.setSearching(false)} />
                )}
              </div>
            ) : (
              <div className="Header__top-bar-search">
                <MdSearch onClick={() => props.setSearching(true)} />
              </div>
            )}
          </div>
        </IonToolbar>
      </IonHeader>
      <IonModal isOpen={showSettings}>
        <Settings
          setShowSettings={setShowSettings}
          dataSource={props.dataSource}
          handleDataSource={props.handleDataSource}
          theme={props.theme}
          setTheme={props.setTheme}
        />
      </IonModal>
    </div>
  );
};

export default Header;
