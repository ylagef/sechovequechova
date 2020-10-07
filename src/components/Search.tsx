import { IonItem, IonLabel, IonInput } from "@ionic/react";
import React, { SetStateAction, useState } from "react";
import aemetTownCodes from "../api/aemet/static/aemet-town-codes";
import owmTownData from "../api/owm-service/static/owm-town-data";
import Card from "../shared/components/Card";
import City from "../shared/models/City";
import "./Search.css";

interface ContainerProps {
  setCurrentCity: any;
  setSearching: any;
  dataSource: any;
}

const Search: React.FC<ContainerProps> = (props) => {
  const [searchValue, setSearchValue]: [string, SetStateAction<any>] = useState(
    ""
  );

  const getFilteredCities = () => {
    return props.dataSource === "aemet"
      ? Object.values(
          aemetTownCodes
            .filter((item) =>
              item.nm
                .toLowerCase()
                .replace(/[^A-Z0-9]/gi, "")
                .includes(searchValue.toLowerCase().replace(/[^A-Z0-9]/gi, ""))
            )
            .sort((a, b) => (a.nm > b.nm ? 1 : -1))
            .map((c) => {
              return { name: c.nm, id: +c.id } as City;
            })
        )
      : Object.values(
          owmTownData
            .filter((item) =>
              item.city
                .toLowerCase()
                .replace(/[^A-Z0-9]/gi, "")
                .includes(searchValue.toLowerCase().replace(/[^A-Z0-9]/gi, ""))
            )
            .sort((a, b) => (a.city > b.city ? 1 : -1))
            .map((c) => {
              return { name: c.city, lat: +c.lat, lon: +c.lon } as City;
            })
        );
  };

  const selectCity = (city: City) => {
    const aemetCity = aemetTownCodes.find(
      (c) =>
        c.nm.toLowerCase().replace(/[^A-Z0-9]/gi, "") ===
        city.name.toLowerCase().replace(/[^A-Z0-9]/gi, "")
    );
    const owmCity = owmTownData.find(
      (c) =>
        c.city.toLowerCase().replace(/[^A-Z0-9]/gi, "") ===
        city.name.toLowerCase().replace(/[^A-Z0-9]/gi, "")
    );

    if (city.id) {
      city.lat = +(owmCity?.lat || 0);
      city.lon = +(owmCity?.lon || 0);
    } else {
      city.id = +(aemetCity?.id || -1);
    }

    props.setCurrentCity(city);
    props.setSearching(false);
  };

  return (
    <div className="Search">
      <div className="Search__searching-div">
        <Card>
          <IonItem className="Search__search-IonItem">
            <IonLabel className="Search__search-IonLabel" position="floating">
              Ciudad
            </IonLabel>
            <IonInput
              value={searchValue}
              onIonChange={(e) => setSearchValue(e.detail.value)}
            ></IonInput>
          </IonItem>
        </Card>
        {searchValue.length > 2 &&
          (getFilteredCities().length > 0 ? (
            <Card>
              {getFilteredCities().map((value: City, i) => (
                <div
                  className="Search__cities-list-city-div fade-in"
                  key={i}
                  onClick={() => selectCity(value)}
                >
                  <div className="Search__cities-list-city-div-inner">
                    <label>{value.name}</label>
                  </div>
                </div>
              ))}
            </Card>
          ) : (
            <Card>
              <label>No hay ciudades con ese criterio</label>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Search;
