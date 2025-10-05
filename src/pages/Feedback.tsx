import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonInput,
  IonTextarea, IonButton, IonToast, IonNote
} from "@ionic/react";
import "./feedback.css";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const validate = () => {
    if (!name.trim() || !email.trim() || !body.trim()) {
      return "Vui lòng điền đầy đủ thông tin.";
    }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) return "Email không hợp lệ.";
    return null;
  };

  const submit = async () => {
    const v = validate();
    if (v) { setErr(v); return; }
    setErr(null);

    // TODO: call API của bạn ở đây
    // await api.post('/feedback', { name, email, content: body })

    setShowToast(true);
    setName(""); setEmail(""); setBody("");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="" />
          </IonButtons>
          <IonTitle>Góp ý</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding bg-soft">
        <IonCard className="feedback-card soft">
          <IonCardContent>
            <IonItem lines="none">
              <IonLabel position="stacked">Tên</IonLabel>
              <IonInput
                value={name}
                placeholder="Nhập tên của bạn"
                onIonInput={(e) => setName(e.detail.value ?? "")}
              />
            </IonItem>

            <IonItem lines="none" className="mt-3">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={email}
                type="email"
                placeholder="ten@domain.com"
                onIonInput={(e) => setEmail(e.detail.value ?? "")}
              />
            </IonItem>

            <IonItem lines="none" className="mt-3">
              <IonLabel position="stacked">Nội dung góp ý</IonLabel>
              <IonTextarea
                autoGrow
                rows={5}
                placeholder="Hãy cho chúng tôi biết góp ý của bạn…"
                value={body}
                onIonInput={(e) => setBody(e.detail.value ?? "")}
              />
            </IonItem>

            {err && (
              <IonNote color="danger" className="mt-2 block">
                {err}
              </IonNote>
            )}

            <div className="actions">
              <IonButton
                fill="outline"
                color="danger"
                routerLink="/"
              >
                Hủy
              </IonButton>
              <IonButton
                color="danger"
                onClick={submit}
              >
                Gửi góp ý
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          message="Đã gửi góp ý. Cảm ơn bạn!"
          duration={1800}
          onDidDismiss={() => setShowToast(false)}
          position="bottom"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
}
