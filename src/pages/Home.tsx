import { IonContent, IonLoading, IonPage } from "@ionic/react";
import React, { SetStateAction, useState } from "react";
import "./Home.css";

import Search from "../components/Search";
import { getWeatherData as getApiWeatherData } from "../api/aemet/services/aemet-service";
import Weather from "../shared/models/Weather";
import { useEffect } from "react";

import { MdClose, MdLocationOn, MdSearch } from "react-icons/md";
import { IoMdSunny, IoMdMoon } from "react-icons/io";

import Current from "../components/Current";
import Divisor from "../shared/components/Divisor";
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

const Home: React.FC = () => {
  const [theme, setTheme]: [string, SetStateAction<any>] = useState("");
  const [showLoading, setShowLoading]: [
    boolean,
    SetStateAction<any>
  ] = useState(false);

  const [searching, setSearching]: [boolean, SetStateAction<any>] = useState(
    false
  );

  const [weatherData, setWeatherData]: [
    Weather,
    SetStateAction<any>
  ] = useState({});

  const handleSetCurrent = async (id: string) => {
    setShowLoading(true);
    localStorage.setItem("city_id", id);

    await getApiWeatherData(id, setWeatherData);

    setShowLoading(false);
  };

  const saveTheme = async (theme: string) => {
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
    if (!theme) {
      document.body.setAttribute("data-theme", "dark");
      saveTheme("dark");
      setTheme("dark");
    } else {
      document.body.setAttribute("data-theme", theme || "");
      setTheme(theme);
    }
  };

  useEffect(() => {
    handleInitialTheme();

    if (localStorage.getItem("city_id")) {
      getApiWeatherData(localStorage.getItem("city_id"), setWeatherData);
    } else {
      setSearching(true);
    }
  }, []);

  const handleTheme = async () => {
    const currentTheme = (await getSavedTheme()).value;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme || "");
    saveTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="Home__top-bar">
          {weatherData && (
            <div className="Home__top-bar-city">
              <MdLocationOn />
              <div className="Home__top-bar-city-name">{weatherData.city}</div>
            </div>
          )}

          {theme === "light" ? (
            <IoMdSunny className="Home__top-bar-theme" onClick={handleTheme} />
          ) : (
            <IoMdMoon className="Home__top-bar-theme" onClick={handleTheme} />
          )}

          {searching ? (
            <div className="Home__top-bar-cancel">
              <MdClose onClick={() => setSearching(false)} />
            </div>
          ) : (
            <div className="Home__top-bar-search">
              <MdSearch onClick={() => setSearching(true)} />
            </div>
          )}
        </div>

        {searching && (
          <Search
            setCurrentCity={handleSetCurrent}
            setSearching={setSearching}
          />
        )}

        {!searching && weatherData && (
          <div>
            <Current weatherData={weatherData} />
            <Divisor width={80} borderWidth={2} />
          </div>
        )}

        <IonLoading isOpen={showLoading} message={"Cargando..."} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
