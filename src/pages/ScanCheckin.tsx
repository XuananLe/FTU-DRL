import React, { useEffect, useRef, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonItem, IonLabel, IonToast
} from "@ionic/react";
import { Html5Qrcode } from "html5-qrcode";
import "./scan.css";

type EventPayload = {
  type: "event"; v: number; t: string; d: string; tm: string; loc: string; pts?: string; source?: string;
};
function isEventPayload(x: any): x is EventPayload {
  return x && x.type === "event" && x.t && x.d && x.tm;
}

export default function ScanCheckin() {
  // IMPORTANT: React will NEVER render children inside this div.
  const REGION_ID = "qr-region";
  const qrRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);    // track if library ever mounted into REGION_ID
  const stoppingRef = useRef(false);   // avoid concurrent stop/clear

  const [scanning, setScanning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [decoded, setDecoded] = useState<EventPayload | null>(null);
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({ open: false, msg: "" });
  const toastMsg = (msg: string) => setToast({ open: true, msg });

  const ensureInstance = () => {
    if (!qrRef.current) qrRef.current = new Html5Qrcode(REGION_ID);
    return qrRef.current!;
  };

  const start = async () => {
    if (busy || scanning) return;
    if (!window.isSecureContext) {
      toastMsg("Cần truy cập bằng HTTPS hoặc localhost để mở camera.");
      return;
    }
    setBusy(true);
    try {
      await doStart();
      startedRef.current = true;
      setScanning(true);
    } catch (e: any) {
      const msg = String(e?.message || e || "");
      if (/AbortError/i.test(msg)) {
        try {
          await sleep(250);
          await doStart();
          startedRef.current = true;
          setScanning(true);
        } catch (e2: any) {
          toastMsg("Không mở được camera: " + (e2?.message || e2));
          // do NOT clear unless started; and only once
          if (startedRef.current) { try { await qrRef.current?.clear(); } catch {} startedRef.current = false; }
        }
      } else {
        toastMsg("Không mở được camera: " + msg);
        if (startedRef.current) { try { await qrRef.current?.clear(); } catch {} startedRef.current = false; }
      }
    } finally {
      setBusy(false);
    }
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
            const side = Math.floor(Math.min(vw, vh) * 0.50); // vuông 25% cạnh ngắn
            return { width: side, height: side };
        },  
        aspectRatio: 1.0, // tùy chọn: gợi ý stream gần vuông hơn nếu video bị quá dẹt
        // disableFlip: false
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
      // stop() then clear() — once. (Library guidance)
      if (qrRef.current) {
        await qrRef.current.stop();
        if (startedRef.current) { await qrRef.current.clear(); startedRef.current = false; }
      }
      setScanning(false);
    } catch {
      // ignore
    } finally {
      stoppingRef.current = false;
      setBusy(false);
    }
  };

  const onScanSuccess = async (text: string) => {
    try {
      const obj = JSON.parse(text);
      if (isEventPayload(obj)) {
        setDecoded(obj);
        await stop();
      } else {
        toastMsg("QR không đúng định dạng sự kiện");
      }
    } catch {
      toastMsg("Đã quét: " + text);
    }
  };
  const onScanError = (_msg: string) => {};

  useEffect(() => {
    if (window.isSecureContext) start();

    const onHide = () => { if (document.visibilityState !== "visible") stop(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", stop);
    window.addEventListener("beforeunload", stop);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", stop);
      window.removeEventListener("beforeunload", stop);
      // Only stop/clear if we actually started and not already cleared.
      (async () => {
        try { if (scanning) await qrRef.current?.stop(); } catch {}
        try { if (startedRef.current) await qrRef.current?.clear(); } catch {}
        startedRef.current = false;
      })();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmCheckin = () => {
    if (!decoded) return;
    const id = `${decoded.t}|${decoded.d}|${decoded.tm}`;
    const key = "zone57_checkins";
    const arr: any[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (arr.some(x => x.id === id)) { toastMsg("Bạn đã check-in sự kiện này rồi"); return; }
    arr.push({ id, at: new Date().toISOString(), payload: decoded });
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
        {/* Wrapper so overlay is a sibling, not a child, of #qr-region */}
        <div className="qr-wrap">
          <div id={REGION_ID} className="qr-cam" />
          {!scanning && <div className="qr-overlay">Camera đang tắt</div>}
        </div>

        <div className="btn-row">
          {scanning ? (
            <IonButton color="medium" disabled={busy} onClick={stop}>Dừng quét</IonButton>
          ) : (
            <IonButton color="primary" disabled={busy} onClick={start}>Bắt đầu quét</IonButton>
          )}
        </div>

        {decoded && (
          <IonCard className="event-card">
            <IonCardHeader><IonCardTitle>{decoded.t}</IonCardTitle></IonCardHeader>
            <IonCardContent>
              <IonItem lines="none"><IonLabel><b>Ngày:</b> {decoded.d}</IonLabel></IonItem>
              <IonItem lines="none"><IonLabel><b>Giờ:</b> {decoded.tm}</IonLabel></IonItem>
              <IonItem lines="none"><IonLabel><b>Địa điểm:</b> {decoded.loc}</IonLabel></IonItem>
              {decoded.pts && <IonItem lines="none"><IonLabel><b>Điểm DRL:</b> {decoded.pts}</IonLabel></IonItem>}
              <div className="btn-row">
                <IonButton color="success" onClick={confirmCheckin}>Xác nhận Check-in</IonButton>
                <IonButton color="medium" onClick={() => setDecoded(null)}>Quét tiếp</IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        <IonToast isOpen={toast.open} message={toast.msg} duration={1800} onDidDismiss={() => setToast({ open: false, msg: "" })}/>
      </IonContent>
    </IonPage>
  );
}

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }