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

const { Storage } = Plugins;

const Home: React.FC = () => {
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

  const [weatherData, setWeatherData]: [
    Weather,
    SetStateAction<any>
  ] = useState({});

  const handleError = (error: string) => {
    setError(error);
    setShowToast(true);
    setSearching(true);
    setShowLoading(false);
  };

  const doRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    setShowLoading(true);
    await owmGetWeatherData(weatherData.city, setWeatherData, handleError);
    event.detail.complete();
    window.scrollTo(0, 0);
    setShowLoading(false);
  };

  const handleSetCurrent = async (city: City) => {
    setShowLoading(true);
    await Storage.set({
      key: "city",
      value: JSON.stringify(city),
    });

    await owmGetWeatherData(city, setWeatherData, handleError);

    setShowLoading(false);
  };

  const handleInitialCity = async () => {
    const storageCity = (
      await Storage.get({
        key: "city",
      })
    ).value;

    const city = storageCity ? JSON.parse(storageCity) : null;

    if (city) {
      await owmGetWeatherData(city, setWeatherData, handleError);
      setShowLoading(false);
    } else {
      setSearching(true);
      setShowLoading(false);
    }
  };

  useEffect(() => {
    setShowLoading(true);
    handleInitialCity();
  }, []);

  return (
    <IonPage>
      <Header
        weatherData={weatherData}
        searching={searching}
        setSearching={setSearching}
      />

      <IonContent fullscreen>
        {searching ? (
          <Search
            setCurrentCity={handleSetCurrent}
            setSearching={setSearching}
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

              <div className="Home__powered">
                Powered by{" "}
                <a className="Home__powered-link" href="https://www.aemet.es">
                  Aemet
                </a>
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
