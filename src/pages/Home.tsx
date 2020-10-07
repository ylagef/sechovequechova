import {
  IonContent,
  IonLoading,
  IonPage,
  IonRefresher,
  IonToast,
} from "@ionic/react";
import React, { SetStateAction, useState } from "react";
import "./Home.css";

import Search from "../components/Search";
import { aemetGetWeatherData } from "../api/aemet/services/aemet-service";
import Weather from "../shared/models/Weather";

import Current from "../components/Current";
import Divisor from "../shared/components/Divisor";
import { RefresherEventDetail } from "@ionic/core";

import { Plugins } from "@capacitor/core";
import Hourly from "../components/Hourly";
import Daily from "../components/Daily";
import Header from "../components/Header";
import { useEffect } from "react";
import { owmGetWeatherData } from "../api/owm-service/services/owm-service";
import City from "../shared/models/City";
import { handleTheme } from "../shared/services/theming";

const { Storage } = Plugins;

const Home: React.FC = () => {
  const [theme, setTheme]: [string, SetStateAction<any>] = useState("dark");

  const [showLoading, setShowLoading]: [
    boolean,
    SetStateAction<any>
  ] = useState(false);
  const [showToast, setShowToast]: [boolean, SetStateAction<any>] = useState(
    false
  );

  const [searching, setSearching]: [boolean, SetStateAction<any>] = useState(
    false
  );

  const [error, setError]: [string, SetStateAction<any>] = useState("");

  const [dataSource, setDataSource]: [string, SetStateAction<any>] = useState(
    "aemet"
  );

  const [weatherData, setWeatherData]: [
    Weather,
    SetStateAction<any>
  ] = useState({});

  const handleDataSource = async (e: any) => {
    setDataSource(e.detail.value);

    await Storage.set({
      key: "data_source",
      value: e.detail.value,
    });
  };

  useEffect(() => {
    if (weatherData.city) {
      doRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  const handleError = async (error: string) => {
    setError(error);
    setShowToast(true);
    setShowLoading(false);
  };

  const doRefresh = async (event?: CustomEvent<RefresherEventDetail>) => {
    setShowLoading(true);
    dataSource === "aemet"
      ? await aemetGetWeatherData(weatherData.city, setWeatherData, handleError)
      : await owmGetWeatherData(weatherData.city, setWeatherData, handleError);

    if (event) {
      event?.detail.complete();
    }

    window.scrollTo(0, 0);
    setShowLoading(false);
  };

  const handleSetCurrent = async (city: City) => {
    setShowLoading(true);
    await Storage.set({
      key: "city",
      value: JSON.stringify(city),
    });

    dataSource === "aemet"
      ? await aemetGetWeatherData(city, setWeatherData, handleError)
      : await owmGetWeatherData(city, setWeatherData, handleError);

    setShowLoading(false);
  };

  const handleInitialCity = async () => {
    const storageData = (
      await Storage.get({
        key: "data",
      })
    ).value;

    const data = storageData ? (JSON.parse(storageData) as Weather) : null;
    if (data) {
      setWeatherData(data);
      setShowLoading(false);
    } else {
      const storageCity = (
        await Storage.get({
          key: "city",
        })
      ).value;

      const city = storageCity ? JSON.parse(storageCity) : null;

      if (city) {
        dataSource === "aemet"
          ? await aemetGetWeatherData(city, setWeatherData, handleError)
          : await owmGetWeatherData(city, setWeatherData, handleError);
        setShowLoading(false);
      } else {
        setSearching(true);
        setShowLoading(false);
      }
    }
  };

  const handleInitialDataSource = async () => {
    const initialDataSource = (
      await Storage.get({
        key: "data_source",
      })
    ).value;

    setDataSource(initialDataSource || "aemet");
  };

  useEffect(() => {
    handleInitialDataSource();
    setShowLoading(true);
    handleInitialCity();
    handleTheme(true, setTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <Header
        weatherData={weatherData}
        searching={searching}
        setSearching={setSearching}
        dataSource={dataSource}
        handleDataSource={handleDataSource}
        theme={theme}
        setTheme={setTheme}
      />

      <IonContent fullscreen>
        {searching ? (
          <Search
            setCurrentCity={handleSetCurrent}
            setSearching={setSearching}
            dataSource={dataSource}
          />
        ) : (
          weatherData.city && (
            <div>
              <IonRefresher
                slot="fixed"
                onIonRefresh={doRefresh}
              ></IonRefresher>

              <Current weatherData={weatherData} />

              <Divisor width={80} borderWidth={2} />

              <Hourly weatherData={weatherData} />

              <Divisor width={80} borderWidth={2} />

              <Daily weatherData={weatherData} />

              <Divisor width={80} borderWidth={2} />

              {weatherData.updated && (
                <div className="Home__last-updated">
                  <label>
                    Última actualización{" "}
                    {new Date(weatherData.updated).toLocaleTimeString()}
                  </label>
                </div>
              )}

              <div className="Home__powered">
                Powered by{" "}
                {dataSource === "aemet" ? (
                  <a className="Home__powered-link" href="https://www.aemet.es">
                    Aemet
                  </a>
                ) : (
                  <a
                    className="Home__powered-link"
                    href="http://www.openweathermap.org"
                  >
                    Open weather
                  </a>
                )}
              </div>
            </div>
          )
        )}

        <IonLoading isOpen={showLoading} message={"Cargando..."} />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={error}
          duration={2000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
