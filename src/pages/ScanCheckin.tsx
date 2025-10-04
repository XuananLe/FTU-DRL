import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonItem, IonLabel, IonToast, IonNote
} from "@ionic/react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import Webcam from "react-webcam";
import "./scan.css";

/** ====== Types ====== */
type EventPayload = {
  type: "event";
  v: number;
  t: string;         // title
  d: string;         // yyyy-mm-dd
  tm: string;        // HH:mm
  loc: string;
  pts?: string;
  source?: string;
  gps?: { lat: number; lng: number; acc?: number }; // vị trí của QR
  expMin?: number;   // thời gian tối đa check-in (phút) kể từ d+tm
};
function isEventPayload(x: any): x is EventPayload {
  return x && x.type === "event" && x.t && x.d && x.tm;
}

/** ====== Helpers ====== */
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

function parseEventDateTimeISO(d: string, tm: string) {
  const [Y, M, D] = d.split("-").map(Number);
  const [h, m] = tm.split(":").map(Number);
  return new Date(Y, (M ?? 1) - 1, D ?? 1, h ?? 0, m ?? 0, 0, 0);
}
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1), φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function ScanCheckin() {
  /** ====== QR state ====== */
  const REGION_ID = "qr-region";
  const qrRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);
  const stoppingRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [decoded, setDecoded] = useState<EventPayload | null>(null);

  /** ====== GPS state ====== */
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [userAcc, setUserAcc] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gettingGPS, setGettingGPS] = useState(false);

  /** ====== Validation ====== */
  const [distance, setDistance] = useState<number | null>(null);
  const [timeLeftMin, setTimeLeftMin] = useState<number | null>(null);
  const [eligible, setEligible] = useState<{ ok: boolean; reason?: string }>({ ok: false });

  /** ====== Selfie bằng react-webcam ====== */
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  /** ====== Toast ====== */
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({ open: false, msg: "" });
  const toastMsg = (msg: string) => setToast({ open: true, msg });

  /** ====== QR start/stop ====== */
  const ensureInstance = () => {
    if (!qrRef.current) qrRef.current = new Html5Qrcode(REGION_ID);
    return qrRef.current!;
  };

  const start = async () => {
    if (busy || scanning) return;
    if (!window.isSecureContext) { toastMsg("Cần HTTPS hoặc localhost để mở camera."); return; }
    setBusy(true);
    try {
      await preflightGPS(); // xin quyền vị trí sớm
      await doStart();
      startedRef.current = true;
      setScanning(true);
    } catch (e: any) {
      const msg = String(e?.message || e || "");
      if (/AbortError/i.test(msg)) {
        try { await sleep(250); await doStart(); startedRef.current = true; setScanning(true); }
        catch (e2: any) { toastMsg("Không mở được camera: " + (e2?.message || e2)); if (startedRef.current) { try { qrRef.current?.clear(); } catch {} startedRef.current = false; } }
      } else {
        toastMsg("Không mở được camera: " + msg);
        if (startedRef.current) { try { qrRef.current?.clear(); } catch {} startedRef.current = false; }
      }
    } finally { setBusy(false); }
  };

    const doStart = async () => {
      const qr = ensureInstance();
      const cams = await Html5Qrcode.getCameras();
      if (!cams.length) throw new Error("Không tìm thấy camera");
      const back = cams.find(c => /back|rear|environment/i.test(c.label)) || cams[0];

      await qr.start(
        back.id,
        {
          fps: 15,
          qrbox: (vw, vh) => {
            const side = Math.floor(Math.min(vw, vh) * 0.60);
            return { width: side, height: side };
          },
          aspectRatio: 1.0,
          // disableFlip: true, // optional
        },
        onScanSuccess,
        onScanError
      );
    };


  const stop = async () => {
    if (busy || !scanning || stoppingRef.current) return;
    stoppingRef.current = true;
    setBusy(true);
    try {
      if (qrRef.current) {
        await qrRef.current.stop();
        if (startedRef.current) { qrRef.current.clear(); startedRef.current = false; }
      }
      setScanning(false);
    } catch {} finally { stoppingRef.current = false; setBusy(false); }
  };

  /** ====== GPS ====== */
  async function preflightGPS() {
    if (!("geolocation" in navigator)) return;
    try {
      // @ts-ignore
      const perm = navigator.permissions?.query ? await navigator.permissions.query({ name: "geolocation" as any }) : null;
      if (!perm || perm.state !== "granted") await askUserGPS();
    } catch {}
  }
  async function askUserGPS() {
    if (!("geolocation" in navigator)) { setGpsError("Trình duyệt không hỗ trợ định vị."); return null; }
    setGettingGPS(true); setGpsError(null);
    return new Promise<GeolocationPosition | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); setUserAcc(pos.coords.accuracy ?? null); setGettingGPS(false); resolve(pos); },
        (err) => { setGpsError(err.message || "Không lấy được vị trí."); setGettingGPS(false); resolve(null); },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  }

  /** ====== Đánh giá điều kiện ====== */
  function evaluateEligibility(payload: EventPayload) {
    // 1) Thời gian
    let timeOk = true, timeReason: string | undefined, minutesLeft: number | null = null;
    if (payload.expMin && Number.isFinite(payload.expMin)) {
      const start = parseEventDateTimeISO(payload.d, payload.tm);
      const expire = new Date(start.getTime() + payload.expMin * 60_000);
      const diff = expire.getTime() - Date.now();
      minutesLeft = Math.floor(diff / 60_000);
      if (diff < 0) { timeOk = false; timeReason = "Đã quá thời gian cho phép check-in."; }
    }
    setTimeLeftMin(minutesLeft);

    // 2) Khoảng cách
    let distOk = true, distReason: string | undefined, dMeters: number | null = null;
    if (payload.gps && userLat != null && userLng != null) {
      dMeters = haversineMeters(userLat, userLng, payload.gps.lat, payload.gps.lng);
      const dynamicRadius = Math.max(100, (userAcc ?? 0) * 2, (payload.gps.acc ?? 0) * 2);
      if (dMeters > dynamicRadius) { distOk = false; distReason = `Ngoài phạm vi (cách ~${Math.round(dMeters)}m, giới hạn ~${Math.round(dynamicRadius)}m).`; }
    }
    setDistance(dMeters);

    const ok = timeOk && distOk;
    setEligible({ ok, reason: !timeOk ? timeReason : !distOk ? distReason : undefined });
  }

  /** ====== QR callbacks ====== */
  const onScanSuccess = async (text: string) => {
    try {
      const obj = JSON.parse(text);
      if (isEventPayload(obj)) {
        setDecoded(obj);
        if (userLat == null || userLng == null) {
          const got = await askUserGPS();
          if (!got && obj.gps) setEligible({ ok: false, reason: "Cần cho phép truy cập vị trí để kiểm tra phạm vi." });
          else evaluateEligibility(obj);
        } else evaluateEligibility(obj);
        await stop();              // dừng camera sau khi decode -> nhường cho webcam selfie
        setShowWebcam(true);       // mở khu vực chụp selfie
      } else {
        toastMsg("QR không đúng định dạng sự kiện");
      }
    } catch { toastMsg("Đã quét: " + text); }
  };
  const onScanError = (_msg: string) => {};

  useEffect(() => { if (decoded) evaluateEligibility(decoded); /* eslint-disable-next-line */ }, [userLat, userLng, userAcc]);

  useEffect(() => {
    const onHide = () => { if (document.visibilityState !== "visible") stop(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", stop);
    window.addEventListener("beforeunload", stop);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", stop);
      window.removeEventListener("beforeunload", stop);
      (async () => {
        try { if (scanning) await qrRef.current?.stop(); } catch {}
        try { if (startedRef.current) qrRef.current?.clear(); } catch {}
        startedRef.current = false;
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ====== React-Webcam config & handlers ====== */
  const videoConstraints: MediaTrackConstraints = {
    facingMode: "user",       // camera trước
    width: { ideal: 640 },
    height: { ideal: 640 }
  };

  const captureSelfie = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPhotoDataUrl(imageSrc);
      setShowWebcam(false);   // ẩn webcam sau khi chụp
    } else {
      toastMsg("Không chụp được ảnh. Hãy thử lại.");
    }
  }, []);

  const confirmCheckin = () => {
    if (!decoded) return;
    if (!eligible.ok) { toastMsg(eligible.reason || "Không đủ điều kiện check-in"); return; }
    if (!photoDataUrl) { toastMsg("Vui lòng chụp ảnh xác nhận khuôn mặt trước khi check-in."); return; }

    const id = `${decoded.t}|${decoded.d}|${decoded.tm}`;
    const key = "zone57_checkins";
    const arr: any[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (arr.some(x => x.id === id)) { toastMsg("Bạn đã check-in sự kiện này rồi"); return; }
    arr.push({
      id,
      at: new Date().toISOString(),
      payload: decoded,
      userGPS: userLat != null && userLng != null ? { lat: userLat, lng: userLng, acc: userAcc } : undefined,
      distance: distance != null ? Math.round(distance) : undefined,
      selfie: photoDataUrl,
    });
    localStorage.setItem(key, JSON.stringify(arr));
    toastMsg("Check-in thành công!");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Quét QR & Check-in</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Khu vực quét QR */}
        {!decoded && (
          <>
            <div className="qr-wrap" style={{ minHeight: 320 }}>
              <div id={REGION_ID} className="qr-cam" style={{ width: "100%", height: "100%" }} />
              {!scanning && <div className="qr-overlay">Camera đang tắt</div>}
            </div>
            <div className="btn-row">
              {scanning
                ? <IonButton color="medium" disabled={busy} onClick={stop}>Dừng quét</IonButton>
                : <IonButton color="primary" disabled={busy} onClick={start}>Bắt đầu quét</IonButton>}
            </div>
          </>
        )}

        {/* Thông tin sự kiện + Selfie */}
        {decoded && (
          <IonCard className="event-card">
            <IonCardHeader><IonCardTitle>{decoded.t}</IonCardTitle></IonCardHeader>
            <IonCardContent>
              <IonItem lines="none"><IonLabel><b>Ngày:</b> {decoded.d}</IonLabel></IonItem>
              <IonItem lines="none"><IonLabel><b>Giờ:</b> {decoded.tm}</IonLabel></IonItem>
              <IonItem lines="none"><IonLabel><b>Địa điểm:</b> {decoded.loc}</IonLabel></IonItem>
              {decoded.pts && <IonItem lines="none"><IonLabel><b>Điểm DRL:</b> {decoded.pts}</IonLabel></IonItem>}

              {decoded.gps && (
                <>
                  <IonItem lines="none">
                    <IonLabel>
                      <b>Điểm check-in (QR):</b> {decoded.gps.lat.toFixed(6)}, {decoded.gps.lng.toFixed(6)}
                      {typeof decoded.gps.acc === "number" && ` (±${Math.round(decoded.gps.acc)}m)`}
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>
                      <b>Vị trí của bạn:</b>{" "}
                      {userLat != null && userLng != null
                        ? `${userLat.toFixed(6)}, ${userLng.toFixed(6)}${userAcc ? ` (±${Math.round(userAcc)}m)` : ""}`
                        : gettingGPS ? "Đang lấy vị trí..." : gpsError ? `Lỗi: ${gpsError}` : "Chưa có"}
                    </IonLabel>
                  </IonItem>
                  {distance != null && (
                    <IonItem lines="none">
                      <IonLabel><b>Khoảng cách ước tính:</b> ~{Math.round(distance)} m</IonLabel>
                    </IonItem>
                  )}
                </>
              )}

              {typeof decoded.expMin === "number" && (
                <IonItem lines="none">
                  <IonLabel>
                    <b>Hạn check-in:</b> {decoded.expMin} phút sau {decoded.tm}
                    {timeLeftMin != null && timeLeftMin >= 0 && <> — còn ~{timeLeftMin} phút</>}
                  </IonLabel>
                </IonItem>
              )}

              {/* React-Webcam selfie */}
              <div className="ion-margin-top">
                <b>Ảnh xác nhận khuôn mặt (bắt buộc)</b>
                {showWebcam && (
                  <div style={{ marginTop: 8 }}>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      mirrored
                      screenshotFormat="image/jpeg"
                      screenshotQuality={0.92}
                      videoConstraints={videoConstraints}
                      imageSmoothing
                      style={{ width: "100%", maxWidth: 360, borderRadius: 12, background: "#000" }}
                    />
                    <div className="btn-row">
                      <IonButton color="success" onClick={captureSelfie}>Chụp ảnh</IonButton>
                      <IonButton color="medium" onClick={() => setShowWebcam(false)}>Đóng</IonButton>
                    </div>
                    <IonNote color="medium">
                      Gợi ý: nếu video không phát trên iPhone, hãy chạm vào vùng video để kích hoạt phát inline.
                    </IonNote>
                  </div>
                )}

                {!showWebcam && !photoDataUrl && (
                  <div className="btn-row">
                    <IonButton onClick={() => { setShowWebcam(true); }} color="medium">Mở camera trước</IonButton>
                  </div>
                )}

                {photoDataUrl && (
                  <div className="selfie-preview" style={{ marginTop: 8 }}>
                    <img src={photoDataUrl} alt="Selfie xác nhận" style={{ width: "100%", maxWidth: 360, borderRadius: 12 }} />
                    <div className="btn-row">
                      <IonButton onClick={() => { setPhotoDataUrl(""); setShowWebcam(true); }} color="medium">
                        Chụp lại
                      </IonButton>
                    </div>
                  </div>
                )}
              </div>

              {!eligible.ok && eligible.reason && (
                <IonNote color="danger" className="ion-margin-top">
                  {eligible.reason}
                </IonNote>
              )}

              <div className="btn-row">
                <IonButton color="success" disabled={!eligible.ok || !photoDataUrl} onClick={confirmCheckin}>
                  Xác nhận Check-in
                </IonButton>
                <IonButton color="medium" onClick={() => { setDecoded(null); setPhotoDataUrl(""); setShowWebcam(false); }}>
                  Quét tiếp
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        <IonToast
          isOpen={toast.open}
          message={toast.msg}
          duration={1800}
          onDidDismiss={() => setToast({ open: false, msg: "" })}
        />
      </IonContent>
    </IonPage>
  );
}
