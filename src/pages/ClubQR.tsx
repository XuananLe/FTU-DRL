import React, { useEffect, useRef, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, IonLabel
} from "@ionic/react";
import QRCode from "qrcode"; // npm i qrcode
import "./ClubQR.css";

type EventForm = {
  title: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:mm
  place: string;
  points: string; // ví dụ: "2 DRL mục 3.1"
};

export default function ClubQR() {
  const [text, setText] = useState("Zone57-CLB");        // chế độ nhanh
  const [dataUrl, setDataUrl] = useState<string>("");     // ảnh QR generate
  const imgRef = useRef<HTMLImageElement>(null);

  // Form sự kiện → generate QR từ payload JSON
  const [form, setForm] = useState<EventForm>({
    title: "",
    date: "",
    time: "",
    place: "",
    points: "",
  });

  // helper
  const makePayload = () => {
    // Payload JSON gọn để app đọc được sau này
    const payload = {
      type: "event",
      v: 1,
      t: form.title.trim(),
      d: form.date,
      tm: form.time,
      loc: form.place.trim(),
      pts: form.points.trim(),
      source: "Zone57",
    };
    return JSON.stringify(payload);
  };

  const generateFromText = async () => {
    const url = await QRCode.toDataURL(text || "Zone57", { margin: 1, width: 512 });
    setDataUrl(url);
    if (imgRef.current) imgRef.current.src = url;
  };

  const generateFromForm = async () => {
    // kiểm tra tối thiểu
    if (!form.title || !form.date || !form.time) {
      alert("Vui lòng nhập ít nhất Tiêu đề, Ngày và Giờ.");
      return;
    }
    const payload = makePayload();
    const url = await QRCode.toDataURL(payload, { margin: 1, width: 1024 });
    setDataUrl(url);
    if (imgRef.current) imgRef.current.src = url;
  };

  const downloadQR = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    const safeName =
      (form.title || text || "Zone57").replace(/[^\p{L}\p{N}\-_ ]/gu, "").slice(0, 50) || "Zone57";
    a.href = dataUrl;
    a.download = `${safeName}_QR.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    generateFromText(); // QR mặc định ban đầu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Zone57</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Tạo QR nhanh từ chuỗi tuỳ ý */}
        <div className="ion-padding">
          <IonItem className="pill" lines="none">
            <IonInput
              value={text}
              onIonChange={(e) => setText(e.detail.value ?? "")}
              placeholder="QR nhanh: nhập chuỗi bất kỳ…"
            />
          </IonItem>
          <IonButton expand="block" shape="round" color="medium" onClick={generateFromText}>
            Tạo QR từ chuỗi
          </IonButton>
        </div>

        {/* Form sự kiện → QR JSON */}
        <div className="ion-padding">
          <div className="form-title">Tạo QR sự kiện</div>
          <IonGrid className="qr-form">
            <IonRow>
              <IonCol size="12">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Tiêu đề sự kiện</IonLabel>
                  <IonInput value={form.title}
                            onIonChange={(e)=>setForm({...form, title: e.detail.value || ""})}
                            placeholder="VD: Workshop: CV chuẩn - Kỹ năng vàng" />
                </IonItem>
              </IonCol>
              <IonCol size="6">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Ngày</IonLabel>
                  <IonInput type="date" value={form.date}
                            onIonChange={(e)=>setForm({...form, date: e.detail.value || ""})} />
                </IonItem>
              </IonCol>
              <IonCol size="6">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Giờ</IonLabel>
                  <IonInput type="time" value={form.time}
                            onIonChange={(e)=>setForm({...form, time: e.detail.value || ""})} />
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Địa điểm</IonLabel>
                  <IonInput value={form.place}
                            onIonChange={(e)=>setForm({...form, place: e.detail.value || ""})}
                            placeholder="VD: A1001, cơ sở D201" />
                </IonItem>
              </IonCol>
              <IonCol size="12">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Điểm DRL / ghi chú</IonLabel>
                  <IonInput value={form.points}
                            onIonChange={(e)=>setForm({...form, points: e.detail.value || ""})}
                            placeholder="VD: 2 DRL mục 3.1" />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonButton expand="block" shape="round" color="danger" onClick={generateFromForm}>
            Tạo QR sự kiện
          </IonButton>

          {/* Preview + Tải về */}
          <div className="ion-text-center ion-margin-top">
            <img ref={imgRef} alt="QR preview" style={{ width: 220, height: 220 }} />
            <div className="btn-row">
              <IonButton disabled={!dataUrl} onClick={downloadQR} shape="round">
                Tải mã QR
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
