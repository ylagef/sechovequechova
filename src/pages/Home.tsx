import {
  IonContent,
  IonHeader,
  IonLoading,
  IonPage,
  IonRefresher,
  IonToolbar,
} from "@ionic/react";
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
import { RefresherEventDetail } from "@ionic/core";

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

  const doRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    setShowLoading(true);
    await getApiWeatherData(weatherData.id, setWeatherData);
    event.detail.complete();
    setShowLoading(false);
  };

  const handleSetCurrent = async (id: string) => {
    setShowLoading(true);
    await Storage.set({
      key: "city_id",
      value: id,
    });

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
      document.body.classList.toggle("dark", true);
      saveTheme("dark");
      setTheme("dark");
    } else {
      document.body.classList.toggle("dark", theme === "dark");
      setTheme(theme);
    }
  };

  const handleInitialCity = async () => {
    const cityId = (
      await Storage.get({
        key: "city_id",
      })
    ).value;

    if (cityId) {
      await getApiWeatherData(cityId, setWeatherData);
      setShowLoading(false);
    } else {
      setSearching(true);
      setShowLoading(false);
    }
  };

  useEffect(() => {
    setShowLoading(true);

    handleInitialTheme();
    handleInitialCity();
  }, []);

  const handleTheme = async () => {
    const currentTheme = (await getSavedTheme()).value;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.classList.toggle("dark", newTheme === "dark");
    saveTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="Home__top-bar">
            <div className="Home__top-bar-city">
              {weatherData.id && (
                <div className="Home__top-bar-city-inner">
                  <MdLocationOn />
                  <div className="Home__top-bar-city-name">
                    {weatherData.city}
                  </div>
                </div>
              )}
            </div>

            {theme === "light" ? (
              <IoMdSunny
                className="Home__top-bar-theme"
                onClick={handleTheme}
              />
            ) : (
              <IoMdMoon className="Home__top-bar-theme" onClick={handleTheme} />
            )}

            {searching ? (
              <div className="Home__top-bar-cancel">
                {weatherData.id && (
                  <MdClose onClick={() => setSearching(false)} />
                )}
              </div>
            ) : (
              <div className="Home__top-bar-search">
                <MdSearch onClick={() => setSearching(true)} />
              </div>
            )}
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {weatherData.id && !searching && (
          <IonRefresher slot="fixed" onIonRefresh={doRefresh}></IonRefresher>
        )}
        {searching && (
          <Search
            setCurrentCity={handleSetCurrent}
            setSearching={setSearching}
          />
        )}
        {!searching && weatherData.id && (
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
