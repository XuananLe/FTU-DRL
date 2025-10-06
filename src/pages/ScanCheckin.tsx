import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonItem, IonLabel, IonToast, IonNote
} from "@ionic/react";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
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
  gps?: { lat: number; lng: number; acc?: number };
  expMin?: number;
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
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function ScanCheckin() {
  /** ====== UI / square layout ====== */
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const setSquare = () => { el.style.height = `${el.clientWidth}px`; };
    setSquare();
    const ro = new ResizeObserver(setSquare);
    ro.observe(el);
    const onResize = () => setSquare();
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /** ====== Scan state ====== */
  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [decoded, setDecoded] = useState<EventPayload | null>(null);

  /** ====== Camera devices ====== */
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceIndex, setDeviceIndex] = useState<number | null>(null);
  const [initialIndex, setInitialIndex] = useState<number>(0);
  const [devicesReady, setDevicesReady] = useState(false);
  const [nonce, setNonce] = useState(0);

  // Get the active device ID more reliably
  const activeDeviceId = 
    deviceIndex !== null && devices[deviceIndex] 
      ? devices[deviceIndex].deviceId 
      : devices[initialIndex]?.deviceId;

  const refreshDevices = useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const vids = list.filter(d => d.kind === "videoinput");
      setDevices(vids);
      if (vids.length) {
        const idx = vids.findIndex(d => /back|rear|environment/i.test(d.label));
        const init = idx >= 0 ? idx : 0;
        setInitialIndex(init);     // index thực tế đang dùng ban đầu
        setDeviceIndex(init);      // Also set deviceIndex to make it work on first click
        setDevicesReady(true);
      } else {
        setDevicesReady(false);
      }
    } catch {
      setDevicesReady(false);
    }
  }, []);

  /** ====== GPS ====== */
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [userAcc, setUserAcc] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gettingGPS, setGettingGPS] = useState(false);

  /** ====== Validation ====== */
  const [distance, setDistance] = useState<number | null>(null);
  const [timeLeftMin, setTimeLeftMin] = useState<number | null>(null);
  const [eligible, setEligible] = useState<{ ok: boolean; reason?: string }>({ ok: false });

  /** ====== Selfie ====== */
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  /** ====== Toast ====== */
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({ open: false, msg: "" });
  const toastMsg = (msg: string) => setToast({ open: true, msg });

  /** ====== Start/Stop ====== */
  const start = async () => {
    if (busy || scanning) return;
    if (!window.isSecureContext) { toastMsg("Cần HTTPS hoặc localhost để mở camera."); return; }
    setBusy(true);
    try {
      await preflightGPS();
      setScanning(true);
      // cho stream chạy trước, iOS mới trả label đầy đủ
      await sleep(300);
      await refreshDevices();
    } catch (e: any) {
      toastMsg("Không mở được camera: " + (e?.message || e));
      setScanning(false);
    } finally { setBusy(false); }
  };
  const stop = () => setScanning(false);

  /** ====== GPS ====== */
  async function preflightGPS() {
    if (!("geolocation" in navigator)) return;
    try {
      // @ts-ignore
      const perm = navigator.permissions?.query
        ? await navigator.permissions.query({ name: "geolocation" as any })
        : null;
      if (!perm || perm.state !== "granted") await askUserGPS();
    } catch { }
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

  /** ====== Eligibility ====== */
  function evaluateEligibility(payload: EventPayload) {
    let timeOk = true, timeReason: string | undefined, minutesLeft: number | null = null;
    if (payload.expMin && Number.isFinite(payload.expMin)) {
      const start = parseEventDateTimeISO(payload.d, payload.tm);
      const expire = new Date(start.getTime() + payload.expMin * 60_000);
      const diff = expire.getTime() - Date.now();
      minutesLeft = Math.floor(diff / 60_000);
      if (diff < 0) { timeOk = false; timeReason = "Đã quá thời gian cho phép check-in."; }
    }
    setTimeLeftMin(minutesLeft);

    let distOk = true, distReason: string | undefined, dMeters: number | null = null;
    if (payload.gps && userLat != null && userLng != null) {
      dMeters = haversineMeters(userLat, userLng, payload.gps.lat, payload.gps.lng);
      const dynamicRadius = Math.max(100, (userAcc ?? 0) * 2, (payload.gps.acc ?? 0) * 2);
      if (dMeters > dynamicRadius) { distOk = false; distReason = `Ngoài phạm vi (cách ~${Math.round(dMeters)}m, giới hạn ~${Math.round(dynamicRadius)}m).`; }
    }
    setDistance(dMeters);
    setEligible({ ok: timeOk && distOk, reason: !timeOk ? timeReason : !distOk ? distReason : undefined });
  }

  /** ====== Decode flow ====== */
  const onDecode = async (text: string) => {
    try {
      const obj = JSON.parse(text);
      if (isEventPayload(obj)) {
        setDecoded(obj);
        if (userLat == null || userLng == null) {
          const got = await askUserGPS();
          if (!got && obj.gps) setEligible({ ok: false, reason: "Cần cho phép truy cập vị trí để kiểm tra phạm vi." });
          else evaluateEligibility(obj);
        } else evaluateEligibility(obj);
        stop();
        setShowWebcam(true);
      } else {
        toastMsg("QR không đúng định dạng sự kiện");
      }
    } catch {
      toastMsg("Đã quét: " + text);
    }
  };

  // API mới: onScan(detectedCodes)
  const onScan = (detectedCodes: IDetectedBarcode[]) => {
    const text = detectedCodes?.[0]?.rawValue;
    if (text) onDecode(text);
  };

  // Đúng kiểu: (error: unknown) => void
  const onError = (_error: unknown) => {
    // tránh spam toast; có thể log nếu cần
  };

  /** ====== React-Webcam ====== */
  const videoConstraints: MediaTrackConstraints = {
    facingMode: "user",
    width: { ideal: 640 },
    height: { ideal: 640 }
  };
  const captureSelfie = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) { setPhotoDataUrl(imageSrc); setShowWebcam(false); }
    else { toastMsg("Không chụp được ảnh. Hãy thử lại."); }
  }, []);

  /** ====== Confirm ====== */
  const confirmCheckin = () => {
    if (!decoded) return;
    if (!eligible.ok) { toastMsg(eligible.reason || "Không đủ điều kiện check-in"); return; }
    if (!photoDataUrl) { toastMsg("Vui lòng chụp ảnh xác nhận khuôn mặt trước khi check-in."); return; }
    const id = `${decoded.t}|${decoded.d}|${decoded.tm}`;
    const key = "zone57_checkins";
    const arr: any[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (arr.some(x => x.id === id)) { toastMsg("Bạn đã check-in sự kiện này rồi"); return; }
    arr.push({
      id, at: new Date().toISOString(), payload: decoded,
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
        {/* Scanner */}
        {!decoded && (
          <>
            <div ref={wrapRef} className="qr-wrap">
              {scanning ? (
                <Scanner
                  key={`scanner-${activeDeviceId || "default"}-${nonce}`}   // ⭐ force remount mỗi lần đổi camera
                  onScan={onScan}
                  onError={onError}
                  constraints={
                    activeDeviceId
                      ? {
                        deviceId: { exact: activeDeviceId },
                        aspectRatio: 1,
                        width: { ideal: 1280 },
                        height: { ideal: 1280 },
                      }
                      : {
                        facingMode: { ideal: "environment" },
                        aspectRatio: 1,
                        width: { ideal: 1280 },
                        height: { ideal: 1280 },
                      }
                  }
                  styles={{
                    container: { width: "100%", height: "100%" },
                    video: { width: "100%", height: "100%", objectFit: "cover" },
                  }}
                />
              ) : (
                <div className="qr-overlay">Camera đang tắt</div>
              )}
            </div>

            <div className="btn-row">
              {scanning ? (
                <>
                  <IonButton color="medium" disabled={busy} onClick={stop}>Dừng quét</IonButton>

                  {devicesReady && devices.length > 1 && (
                    <IonButton
                      color="tertiary"
                      onClick={() => {
                        if (!devices.length) return;
                        const current = (deviceIndex ?? initialIndex);
                        const next = (current + 1) % devices.length;
                        
                        // Update both state variables in a batch to prevent needing two clicks
                        setDeviceIndex(next);
                        setInitialIndex(next);
                        
                        // Force remount of the Scanner component with the new camera
                        setTimeout(() => {
                          setNonce(n => n + 1);
                        }, 10);
                      }}
                    >
                      Đổi camera
                    </IonButton>
                  )}
                </>
              ) : (
                <IonButton color="primary" disabled={busy} onClick={start}>Bắt đầu quét</IonButton>
              )}
            </div>
          </>
        )}

        {/* Event + Selfie */}
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

              {/* Selfie */}
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
                      Nếu video không phát trên iPhone, hãy chạm vào vùng video để kích hoạt phát inline.
                    </IonNote>
                  </div>
                )}

                {!showWebcam && !photoDataUrl && (
                  <div className="btn-row">
                    <IonButton onClick={() => setShowWebcam(true)} color="medium">Mở camera trước</IonButton>
                  </div>
                )}

                {photoDataUrl && (
                  <div className="selfie-preview" style={{ marginTop: 8 }}>
                    <img src={photoDataUrl} alt="Selfie xác nhận" style={{ width: "100%", maxWidth: 360, borderRadius: 12 }} />
                    <div className="btn-row" style={{ marginTop: 8 }}>
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
                <IonButton
                  color="medium"
                  onClick={() => {
                    setDecoded(null);
                    setPhotoDataUrl("");
                    setShowWebcam(false);
                    setDistance(null);
                    setTimeLeftMin(null);
                    setEligible({ ok: false });
                  }}
                >
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
