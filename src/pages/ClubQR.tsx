// src/pages/ClubQR.tsx
import React, { useEffect, useRef, useState } from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton } from "@ionic/react";
import QRCode from "qrcode"; // npm i qrcode
import "./ClubQR.css";

export default function ClubQR(){
  const [text, setText] = useState("Zone57-CLB");
  const imgRef = useRef<HTMLImageElement>(null);

  const generate = async () => {
    const url = await QRCode.toDataURL(text, { margin: 1, width: 256 });
    if (imgRef.current) imgRef.current.src = url;
  };

  useEffect(() => { generate(); /* gen mặc định */ }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Zone57</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Mock camera layer + frame */}
        <div className="qr-mock">
          <div className="brand">Zone57</div>
          <div className="scan-frame" />
          <div className="zoom">
            <div className="zoom-track"><div className="zoom-thumb" style={{width:'40%'}} /></div>
            <div className="zoom-plus">+</div>
          </div>
        </div>

        {/* QR generator (demo) */}
        <div className="ion-padding">
          <IonItem className="pill" lines="none">
            <IonInput value={text} onIonChange={(e)=>setText(e.detail.value!)} placeholder="Nội dung QR..." />
          </IonItem>
          <IonButton expand="block" shape="round" color="danger" onClick={generate}>Tạo QR</IonButton>
          <div className="ion-text-center ion-margin-top">
            <img ref={imgRef} alt="QR preview" style={{width:180, height:180}} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
