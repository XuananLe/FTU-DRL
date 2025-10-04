import React, { useRef, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonGrid, IonRow, IonCol, IonLabel, IonNote, IonIcon,
  IonSearchbar
} from "@ionic/react";
import { locateOutline } from "ionicons/icons";
import QRCode from "qrcode";
import "./ClubQR.css";

type EventForm = {
  title: string;
  date: string;   // dd-mm-yy (UI)
  time: string;   // HH:mm
  place: string;
  points: string;
  lat: string;    // vĩ độ
  lng: string;    // kinh độ
  ttlMin: string; // phút cho phép checkin
};

const pad = (n: number) => String(n).padStart(2, "0");
const now = new Date();
const defaultDateDDMMYY = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${String(now.getFullYear()).slice(-2)}`;
const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
const fmtNum = (n: number, d = 6) => Number.isFinite(n) ? n.toFixed(d) : "";

function normalizeDDMMYY(raw: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 6);
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 6);
  let out = d;
  if (m) out += "-" + m;
  if (y) out += "-" + y;
  return out;
}

function ddmmyyToISODateOnly(ddmmyy: string) {
  const m = ddmmyy.match(/^(\d{2})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const [_, dd, mm, yy] = m;
  const fullYear = Number(yy) + (Number(yy) <= 69 ? 2000 : 1900);
  return `${fullYear}-${mm}-${dd}`; // yyyy-mm-dd
}

function joinISODateTime(dateISO: string, hhmm: string) {
  // trả về ISO string (local) theo dạng yyyy-mm-ddTHH:mm:00
  // (app đọc payload nên chỉ cần thống nhất format)
  const [hh, mm] = (hhmm || "").split(":").map(Number);
  if (!dateISO || isNaN(hh!) || isNaN(mm!)) return "";
  const dt = new Date(dateISO);
  dt.setHours(hh || 0, mm || 0, 0, 0);
  return dt.toISOString();
}

export default function ClubQR() {
  const [dataUrl, setDataUrl] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [gpsAcc, setGpsAcc] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const [form, setForm] = useState<EventForm>({
    title: "",
    date: defaultDateDDMMYY,
    time: defaultTime,
    place: "",
    points: "",
    lat: "",
    lng: "",
    ttlMin: "120", // mặc định 120 phút
  });

  const makePayload = () => {
    const dateISOOnly = ddmmyyToISODateOnly(form.date); // yyyy-mm-dd
    const startISO = joinISODateTime(dateISOOnly, form.time); // ISO bắt đầu
    const ttl = Math.max(0, Number(form.ttlMin || 0)); // không âm
    let expISO: string | undefined = undefined;

    if (startISO && ttl > 0) {
      const start = new Date(startISO);
      const exp = new Date(start.getTime() + ttl * 60_000);
      expISO = exp.toISOString();
    }

    const payload = {
      type: "event",
      v: 1,
      t: form.title.trim(),
      d: dateISOOnly,     // yyyy-mm-dd
      tm: form.time,      // HH:mm
      start: startISO,    // ISO datetime bắt đầu
      ttlMin: ttl,        // TTL phút
      exp: expISO,        // ISO datetime hết hạn
      loc: form.place.trim(),
      pts: form.points.trim(),
      gps: form.lat && form.lng ? {
        lat: Number(form.lat),
        lng: Number(form.lng),
        acc: gpsAcc ?? undefined
      } : undefined,
      source: "Zone57",
    };

    return JSON.stringify(payload);
  };

  const generateFromForm = async () => {
    if (!form.title) {
      alert("Vui lòng nhập Tiêu đề.");
      return;
    }
    const dateISOOnly = ddmmyyToISODateOnly(form.date);
    if (!dateISOOnly) {
      alert("Ngày không hợp lệ. Định dạng đúng: dd-mm-yy (ví dụ 29-09-25).");
      return;
    }
    if (!form.time) {
      alert("Vui lòng nhập Giờ.");
      return;
    }
    // TTL bắt buộc số >= 0
    if (form.ttlMin === "" || isNaN(Number(form.ttlMin)) || Number(form.ttlMin) < 0) {
      alert("Thời gian tối đa (phút) phải là số không âm.");
      return;
    }
    // GPS không bắt buộc, nhưng nếu nhập thì phải hợp lệ
    if ((form.lat && isNaN(Number(form.lat))) || (form.lng && isNaN(Number(form.lng)))) {
      alert("Vĩ độ/Kinh độ phải là số hợp lệ.");
      return;
    }

    const url = await QRCode.toDataURL(makePayload(), { margin: 1, width: 1024 });
    setDataUrl(url);
    if (imgRef.current) imgRef.current.src = url;
  };

  const downloadQR = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    const safeName = (form.title || "Zone57").replace(/[^\p{L}\p{N}\-_ ]/gu, "").slice(0, 50) || "Zone57";
    a.href = dataUrl;
    a.download = `${safeName}_QR.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getCurrentGPS = async () => {
    if (!("geolocation" in navigator)) {
      setGpsError("Trình duyệt không hỗ trợ định vị.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    setGpsAcc(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setForm((f) => ({
          ...f,
          lat: fmtNum(latitude),
          lng: fmtNum(longitude),
          place: f.place || `GPS @ ${fmtNum(latitude, 5)}, ${fmtNum(longitude, 5)}`
        }));
        setGpsAcc(accuracy);
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(err.message || "Không lấy được vị trí.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <IonPage>
      
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
        <IonTitle className="zone-title ion-text-center">Zone57</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          {/* <div className="form-title">QR</div> */}

          <IonGrid className="qr-form">
            <IonRow>
              <IonCol size="12">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Tiêu đề sự kiện</IonLabel>
                  <IonInput
                    value={form.title}
                    onIonChange={(e) => setForm({ ...form, title: e.detail.value || "" })}
                    placeholder="VD: Workshop: CV chuẩn - Kỹ năng vàng"
                  />
                </IonItem>
              </IonCol>

              <IonCol size="6">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Ngày (dd-mm-yy)</IonLabel>
                  <IonInput
                    type="text"
                    inputMode="numeric"
                    value={form.date}
                    onIonChange={(e) => setForm({ ...form, date: normalizeDDMMYY(e.detail.value || "") })}
                    placeholder="dd-mm-yy"
                    maxlength={8}
                  />
                </IonItem>
              </IonCol>

              <IonCol size="6">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Giờ</IonLabel>
                  <IonInput
                    type="time"
                    value={form.time}
                    onIonChange={(e) => setForm({ ...form, time: e.detail.value || "" })}
                  />
                </IonItem>
              </IonCol>

              <IonCol size="12">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Địa điểm (mô tả)</IonLabel>
                  <IonInput
                    value={form.place}
                    onIonChange={(e) => setForm({ ...form, place: e.detail.value || "" })}
                    placeholder="VD: A1001, cơ sở D201"
                  />
                </IonItem>
              </IonCol>

              {/* GPS */}
              <IonCol size="6">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Vĩ độ (lat)</IonLabel>
                  <IonInput
                    inputMode="decimal"
                    value={form.lat}
                    onIonChange={(e) => setForm({ ...form, lat: (e.detail.value || "").trim() })}
                    placeholder="VD: 21.027764"
                  />
                </IonItem>
              </IonCol>
              <IonCol size="6">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Kinh độ (lng)</IonLabel>
                  <IonInput
                    inputMode="decimal"
                    value={form.lng}
                    onIonChange={(e) => setForm({ ...form, lng: (e.detail.value || "").trim() })}
                    placeholder="VD: 105.834160"
                  />
                </IonItem>
              </IonCol>

              <IonCol size="12" className="ion-margin-bottom">
                <IonButton onClick={getCurrentGPS} color="medium" fill="outline" shape="round" disabled={gpsLoading}>
                  <IonIcon slot="start" icon={locateOutline} />
                  {gpsLoading ? "Đang lấy vị trí..." : "Lấy vị trí hiện tại"}
                </IonButton>
                {gpsAcc !== null && (
                  <IonNote className="ion-padding-start" color="medium">
                    Độ chính xác ~ {Math.round(gpsAcc)} m
                  </IonNote>
                )}
                {gpsError && (
                  <IonNote className="ion-padding-start" color="danger">
                    {gpsError}
                  </IonNote>
                )}
              </IonCol>

              {/* TTL minutes */}
              <IonCol size="12">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Thời gian tối đa cho checkin (phút)</IonLabel>
                  <IonInput
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={form.ttlMin}
                    onIonChange={(e) => setForm({ ...form, ttlMin: (e.detail.value || "").replace(/[^\d]/g, "") })}
                    placeholder="VD: 120"
                  />
                </IonItem>
                <IonNote color="medium" className="ion-margin-top" style={{ display: "block" }}>
                  Hết thời gian này QR sẽ hết hạn
                </IonNote>
              </IonCol>

              <IonCol size="12">
                <IonItem className="pill" lines="none">
                  <IonLabel position="stacked">Điểm DRL / ghi chú</IonLabel>
                  <IonInput
                    value={form.points}
                    onIonChange={(e) => setForm({ ...form, points: e.detail.value || "" })}
                    placeholder="VD: 2 DRL mục 3.1"
                  />
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonButton expand="block" shape="round" color="danger" onClick={generateFromForm}>
            Tạo QR sự kiện
          </IonButton>

          <div className="ion-text-center ion-margin-top">
            {dataUrl && (
              <>
                <img ref={imgRef} alt="QR preview" src={dataUrl} style={{ width: 220, height: 220 }} />
                <div className="btn-row">
                  <IonButton onClick={downloadQR} shape="round" color="danger">
                    Tải mã QR
                  </IonButton>
                </div>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
