import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>Hello world</IonContent>
    </IonPage>
  );
};

export default Home;
