import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react";
import "./Dashboard.css";

export default function Dashboard(){
  const bars = [40, 60, 30, 80, 55, 72, 50]; // demo %
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader><IonCardTitle>Thống kê lượt check-in theo ngày</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <div className="bar-chart">
              {bars.map((h,i)=>(<div key={i} className="bar" style={{height:`${h}%`}} />))}
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader><IonCardTitle>Tỷ lệ tham gia theo khoa</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <div className="line-chart">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                <polyline fill="none" stroke="#b30018" strokeWidth="2"
                  points="0,30 15,26 30,28 45,20 60,22 75,18 90,10 100,12" />
              </svg>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
