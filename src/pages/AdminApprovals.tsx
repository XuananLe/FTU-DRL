import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent } from "@ionic/react";

export default function AdminApprovals(){
  return (
    <IonCard>
      <IonCardHeader><IonCardTitle>Phê duyệt Sự kiện</IonCardTitle></IonCardHeader>
      <IonCardContent className="card-pad">
        Danh sách sự kiện chờ duyệt (demo chưa có sự kiện chờ)
      </IonCardContent>
    </IonCard>
  );
}
