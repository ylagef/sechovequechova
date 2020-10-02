import { IonContent, IonLoading, IonPage } from "@ionic/react";
import React, { SetStateAction, useState } from "react";
import "./Home.css";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Search from "../components/shared/Search";
import "../models/Daily";
import Daily from "../models/Daily";
import Hourly from "../models/Hourly";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const Home: React.FC = () => {
  const [showLoading, setShowLoading]: [
    boolean,
    SetStateAction<any>
  ] = useState(false);

  const [searching, setSearching]: [boolean, SetStateAction<any>] = useState(
    true
  );

  const [hourlyData, setHourlyData]: [Hourly, SetStateAction<any>] = useState(
    {}
  );

  const [dailyData, setDailyData]: [Daily, SetStateAction<any>] = useState({});

  const handleSetCurrent = async (id: string) => {
    setShowLoading(true);

    await Promise.all([getHourlyData(id), getDailyData(id)]);
    setShowLoading(false);
  };

  const getHourlyData = (id: string) => {
    return fetch(
      `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/${id}`,
      {
        headers: {
          accept: "application/json",
          api_key:
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5bGFnZWZAZ21haWwuY29tIiwianRpIjoiZWFlZWNmODMtZDA2NS00MGQ5LWEwNTktZjIyMjg5MDJjNjMzIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MDE2Mjk3MzEsInVzZXJJZCI6ImVhZWVjZjgzLWQwNjUtNDBkOS1hMDU5LWYyMjI4OTAyYzYzMyIsInJvbGUiOiIifQ.izyvn53NgERnzvtGXdv9JR6S_6sbgDOf1D68S6S6Vm0",
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.estado === 200) {
            return fetch(result.datos, {
              headers: {
                accept: "application/json",
                api_key:
                  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5bGFnZWZAZ21haWwuY29tIiwianRpIjoiZWFlZWNmODMtZDA2NS00MGQ5LWEwNTktZjIyMjg5MDJjNjMzIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MDE2Mjk3MzEsInVzZXJJZCI6ImVhZWVjZjgzLWQwNjUtNDBkOS1hMDU5LWYyMjI4OTAyYzYzMyIsInJvbGUiOiIifQ.izyvn53NgERnzvtGXdv9JR6S_6sbgDOf1D68S6S6Vm0",
              },
            })
              .then((res) => res.json())
              .then(
                (data: Daily[]) => {
                  console.log("hourly", data[0]);
                  setHourlyData(data[0]);
                },
                (error) => {
                  console.error(error);
                }
              );
          } else {
            console.error(result.descripcion);
          }
        },
        (error) => {
          console.error("err!", error);
        }
      );
  };

  const getDailyData = (id: string) => {
    return fetch(
      `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${id}`,
      {
        headers: {
          accept: "application/json",
          api_key:
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5bGFnZWZAZ21haWwuY29tIiwianRpIjoiZWFlZWNmODMtZDA2NS00MGQ5LWEwNTktZjIyMjg5MDJjNjMzIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MDE2Mjk3MzEsInVzZXJJZCI6ImVhZWVjZjgzLWQwNjUtNDBkOS1hMDU5LWYyMjI4OTAyYzYzMyIsInJvbGUiOiIifQ.izyvn53NgERnzvtGXdv9JR6S_6sbgDOf1D68S6S6Vm0",
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.estado === 200) {
            return fetch(result.datos, {
              headers: {
                accept: "application/json",
                api_key:
                  "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5bGFnZWZAZ21haWwuY29tIiwianRpIjoiZWFlZWNmODMtZDA2NS00MGQ5LWEwNTktZjIyMjg5MDJjNjMzIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2MDE2Mjk3MzEsInVzZXJJZCI6ImVhZWVjZjgzLWQwNjUtNDBkOS1hMDU5LWYyMjI4OTAyYzYzMyIsInJvbGUiOiIifQ.izyvn53NgERnzvtGXdv9JR6S_6sbgDOf1D68S6S6Vm0",
              },
            })
              .then((res) => res.json())
              .then(
                (data: Daily[]) => {
                  console.log("daily", data[0]);
                  setDailyData(data[0]);
                },
                (error) => {
                  console.error(error);
                }
              );
          } else {
            console.error(result.descripcion);
          }
        },
        (error) => {
          console.error("err!", error);
        }
      );
  };

  const getCurrentTemp = () => {
    return null;
    // return hourlyData?.prediccion?.dia?
    // .temperatura?.find((t)=>t.periodo===(new Date()).getHours()).;
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <ThemeProvider theme={theme}>
          {searching && (
            <Search
              setCurrentCity={handleSetCurrent}
              setSearching={setSearching}
            />
          )}

          {!searching && dailyData && <h1>{dailyData.nombre}</h1>}
        </ThemeProvider>

        <IonLoading isOpen={showLoading} message={"Cargando..."} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
