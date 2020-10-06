import React, { SetStateAction, useEffect, useState } from "react";
import "./Header.css";
import { IonHeader, IonToolbar } from "@ionic/react";
import { IoMdSunny, IoMdMoon } from "react-icons/io";
import { MdLocationOn, MdClose, MdSearch } from "react-icons/md";
import { Plugins } from "@capacitor/core";
import Weather from "../shared/models/Weather";
const { Storage } = Plugins;

interface ContainerProps {
  weatherData: Weather;
  searching: boolean;
  setSearching: any;
}

const Header: React.FC<ContainerProps> = (props) => {
  const [theme, setTheme]: [string, SetStateAction<any>] = useState("dark");

  const saveTheme = async (theme: string) => {
    setTheme(theme);

    await Storage.set({
      key: "theme",
      value: theme,
    });
  };

  const getSavedTheme = () => {
    return Storage.get({
      key: "theme",
    });
  };

  const handleInitialTheme = async () => {
    const theme = (await getSavedTheme()).value;
    document.body.classList.toggle("dark", theme ? theme === "dark" : true);
    saveTheme(theme || "dark");
  };

  const handleTheme = async (initial?: boolean) => {
    const savedTheme = (await getSavedTheme()).value;

    const newTheme = !initial
      ? savedTheme === "dark"
        ? "light"
        : "dark"
      : savedTheme;

    document.body.classList.toggle(
      "dark",
      savedTheme ? savedTheme === "dark" : true
    );
    saveTheme(newTheme || "dark");
  };

  useEffect(() => {
    handleTheme(true);
  }, []);

  return (
    <div className="Header">
      <IonHeader>
        <IonToolbar>
          <div className="Home__top-bar">
            <div className="Home__top-bar-city">
              {props.weatherData.city && (
                <div className="Home__top-bar-city-inner">
                  <MdLocationOn />
                  <div className="Home__top-bar-city-name">
                    {props.weatherData.city.name}
                  </div>
                </div>
              )}
            </div>

            {theme === "light" ? (
              <IoMdSunny
                className="Home__top-bar-theme"
                onClick={() => handleTheme()}
              />
            ) : (
              <IoMdMoon
                className="Home__top-bar-theme"
                onClick={() => handleTheme()}
              />
            )}

            {props.searching ? (
              <div className="Home__top-bar-cancel">
                {props.weatherData.city && (
                  <MdClose onClick={() => props.setSearching(false)} />
                )}
              </div>
            ) : (
              <div className="Home__top-bar-search">
                <MdSearch onClick={() => props.setSearching(true)} />
              </div>
            )}
          </div>
        </IonToolbar>
      </IonHeader>
    </div>
  );
};

export default Header;
