import { IonItem, IonLabel, IonInput } from "@ionic/react";
import React, { SetStateAction, useState } from "react";
import townCodes from "../api/aemet/static/town-codes";
import Card from "../shared/components/Card";
import "./Search.css";

interface ContainerProps {
  setCurrentCity: any;
  setSearching: any;
}

const Search: React.FC<ContainerProps> = (props) => {
  const [searchValue, setSearchValue]: [string, SetStateAction<any>] = useState(
    ""
  );

  const getFilteredCities = () => {
    return Object.values(
      townCodes.filter((item) =>
        item.nm.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  const selectCity = (id: string) => {
    props.setCurrentCity(id);
    props.setSearching(false);
  };

  return (
    <div className="Search">
      <div className="Search__searching-div">
        <Card>
          <IonItem className="Search__search-IonItem">
            <IonLabel position="floating">Ciudad</IonLabel>
            <IonInput
              value={searchValue}
              onIonChange={(e) => setSearchValue(e.detail.value)}
            ></IonInput>
          </IonItem>
        </Card>
        {searchValue.length > 2 &&
          (getFilteredCities().length > 0 ? (
            <Card>
              {getFilteredCities().map((value, i) => (
                <div
                  className="Search__cities-list-city-div fade-in"
                  key={i}
                  onClick={() => selectCity(value.id)}
                >
                  <div className="Search__cities-list-city-div-inner">
                    <label>{value.nm}</label>
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
