// pages/SettingsPage.tsx
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonToggle,
  IonSegment, IonSegmentButton, IonText
} from "@ionic/react";
import "./SettingsPage.css";
import { useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";
type Lang = "vi" | "en";

export default function SettingsPage() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [lang, setLang] = useState<Lang>("vi");

  useEffect(() => {
    const saved = localStorage.getItem("settings");
    if (saved) {
      const s = JSON.parse(saved);
      if (typeof s.pushEnabled === "boolean") setPushEnabled(s.pushEnabled);
      if (typeof s.vibrateEnabled === "boolean") setVibrateEnabled(s.vibrateEnabled);
      if (typeof s.soundEnabled === "boolean") setSoundEnabled(s.soundEnabled);
      if (s.fontSize) setFontSize(s.fontSize);
      if (s.lang) setLang(s.lang);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ pushEnabled, vibrateEnabled, soundEnabled, fontSize, lang })
    );
    document.documentElement.setAttribute("data-font-size", fontSize);
  }, [pushEnabled, vibrateEnabled, soundEnabled, fontSize, lang]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab3" text="" />
          </IonButtons>
          <IonTitle className="zone-title">Cài đặt</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="block-card">
          <div className="block-head">Thông báo & Âm thanh</div>
          <IonCardContent className="p0">
            <IonItem lines="full">
            <IonLabel>Bật/tắt thông báo đẩy</IonLabel>
            <IonToggle
                slot="end"              // ⬅️ thêm slot end
                mode="ios"
                color="danger"
                checked={pushEnabled}
                onIonChange={(e) => setPushEnabled(e.detail.checked)}
            />
            </IonItem>
            <IonItem lines="full">
              <IonLabel>Rung khi có thông báo</IonLabel>
              <IonToggle
                slot="end"
                mode="ios"
                color="danger"
                checked={vibrateEnabled}
                onIonChange={(e) => setVibrateEnabled(e.detail.checked)}
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Âm thanh thông báo</IonLabel>
              <IonToggle
                mode="ios"
                slot="end"
                color="danger"
                checked={soundEnabled}
                onIonChange={(e) => setSoundEnabled(e.detail.checked)}
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Cỡ chữ */}
        <IonCard className="block-card">
          <div className="block-head">Cỡ chữ</div>
          <IonCardContent>
            {/* iOS segmented pill */}
            <IonSegment
              mode="ios"
              value={fontSize}
              onIonChange={(e) => setFontSize(e.detail.value as FontSize)}
              className="pill-segment"
            >
              <IonSegmentButton value="small">Nhỏ</IonSegmentButton>
              <IonSegmentButton value="medium">Vừa</IonSegmentButton>
              <IonSegmentButton value="large">Lớn</IonSegmentButton>
            </IonSegment>
            <IonText className="hint">Áp dụng cho nội dung trong ứng dụng.</IonText>
          </IonCardContent>
        </IonCard>

        {/* Ngôn ngữ */}
        <IonCard className="block-card">
          <div className="block-head">Ngôn ngữ</div>
          <IonCardContent>
            <div className="lang-row">
              <button
                className={`lang-btn ${lang === "vi" ? "active" : ""}`}
                onClick={() => setLang("vi")}
              >
                🇻🇳 Tiếng Việt
              </button>
              <button
                className={`lang-btn outline ${lang === "en" ? "active" : ""}`}
                onClick={() => setLang("en")}
              >
                Eng English
              </button>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Khác */}
        <IonCard className="block-card">
          <div className="block-head">Khác</div>
          <IonCardContent className="p0">
            <IonItem button detail lines="full" routerLink="/help-center">
              <IonLabel>Trung tâm trợ giúp <span className="qmark">?</span></IonLabel>
            </IonItem>
            <IonItem button detail lines="none" routerLink="/support-policy">
              <IonLabel>Chính sách hỗ trợ / FAQ</IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
