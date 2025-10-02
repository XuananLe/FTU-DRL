import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel,
  IonItem, IonIcon, IonInput, IonButton, IonText,
  IonSelect, IonSelectOption,
  useIonRouter
} from '@ionic/react';
import { person, mail, lockClosed, school, eye, eyeOff } from 'ionicons/icons';

export default function Auth() {
  const [tab, setTab] = useState<'signup'|'signin'>('signup');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger">
          <IonButtons slot="start"><IonBackButton defaultHref="/" /></IonButtons>
          <IonTitle>TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG</IonTitle>
        </IonToolbar>
        <IonToolbar color="danger" className="seg-toolbar">
          <IonSegment value={tab} onIonChange={e => setTab(e.detail.value)}>
            <IonSegmentButton value="signup"><IonLabel>Sign Up</IonLabel></IonSegmentButton>
            <IonSegmentButton value="signin"><IonLabel>Sign In</IonLabel></IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding auth-bg">
        {tab === 'signup' ? <SignUp/> : <SignIn/>}
      </IonContent>
    </IonPage>
  );
}

function PillItem({ icon, children }: { icon: any; children: any }) {
  return (
    <IonItem lines="none" className="pill">
      <IonIcon icon={icon} slot="start" />
      {children}
    </IonItem>
  );
}

function SignUp() {
  const [show, setShow] = useState(false);
  return (
    <div style={{maxWidth: 420, margin: '0 auto'}}>
      <div className="ion-text-center ion-margin-top">
        <div className="logo-circle" />
      </div>

      <div className="field-stack">
        <PillItem icon={person}><IonInput placeholder="Họ và tên" /></PillItem>
        <PillItem icon={school}><IonInput placeholder="MSSV" /></PillItem>
        <PillItem icon={school}><IonInput placeholder="Lớp/Khoá/Chuyên ngành" /></PillItem>
        <PillItem icon={mail}><IonInput type="email" placeholder="Email" /></PillItem>
        <IonItem lines="none" className="pill">
          <IonIcon icon={lockClosed} slot="start" />
          <IonInput type={show ? 'text' : 'password'} placeholder="Password" />
          <IonButton size="small" fill="clear" slot="end" onClick={() => setShow(v => !v)}>
            <IonIcon slot="icon-only" icon={show ? eyeOff : eye} />
          </IonButton>
        </IonItem>
      </div>

      <IonButton expand="block" shape="round" size="large" className="cta" routerLink="/tabs/home" color={"danger"}>
        Create an account
      </IonButton>

      <div className="version-wrap">
        <div className="version-panel">
          <p>Version: DHNT-2025.09G.31</p>
          <p>Design by UNICARE.VN</p>
        </div>
      </div>
    </div>
  );
}



function SignIn() {
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState<'sinhvien'|'clb'|'nhatruong'>('sinhvien'); // <— NEW
  const router = useIonRouter();                                               // <— NEW

  const handleSignIn = () => {
    // lưu role (để Tabs đọc)
    localStorage.setItem('role', role); // chỉ lưu "vai trò", KHÔNG lưu token/mật khẩu ở đây

    if (role === 'sinhvien') router.push('/tabs/home', 'root');
    else if (role === 'clb')  router.push('/tabs/qr',   'root');
    else                      router.push('/dashboard', 'root');
  };

  
  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      <div className="ion-text-center ion-margin-top">
        <div className="logo-circle" />
        <h2>Welcome Back !</h2>
      </div>

      {/* Vai trò */}
      <IonItem lines="none" className="pill">
        <IonSelect
          interface="popover"
          value={role}
          placeholder="Chọn vai trò"
          onIonChange={(e) => setRole(e.detail.value)}
        >
          <IonSelectOption value="sinhvien">Sinh viên</IonSelectOption>
          <IonSelectOption value="clb">CLB</IonSelectOption>
          <IonSelectOption value="nhatruong">Nhà trường</IonSelectOption>
        </IonSelect>
      </IonItem>

      {/* Email */}
      <PillItem icon={mail}><IonInput type="email" placeholder="Email" /></PillItem>

      {/* Password + toggle eye */}
      <IonItem lines="none" className="pill">
        <IonIcon icon={lockClosed} slot="start" />
        <IonInput type={showPwd ? "text" : "password"} placeholder="Password" />
        <IonButton size="small" fill="clear" slot="end" onClick={() => setShowPwd((v) => !v)}>
          <IonIcon slot="icon-only" icon={showPwd ? eyeOff : eye} />
        </IonButton>
      </IonItem>

      {/* Remember + quên mật khẩu (giữ nguyên) */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
        <label style={{fontSize:12,color:"#666"}}>
          <input type="checkbox" style={{marginRight:6}}/> Remember Password
        </label>
        <IonButton fill="clear" size="small">Forget Password?</IonButton>
      </div>

      {/* CTA: dùng handleSignIn để điều hướng theo vai trò */}
      <IonButton expand="block" shape="round" color="danger" className="cta" onClick={handleSignIn}>
        Sign In
      </IonButton>

      <div className="ion-text-center" style={{ marginTop: 14, fontSize: 14 }}>
        Don't have an account? <b>Sign up</b>
      </div>

      <div className="sep"><span>Or sign in with</span></div>

      <div className="version-wrap">
        <div className="version-panel">
          <p>Version: DHNT-2025.09G.31</p>
          <p>Design by UNICARE.VN</p>
        </div>
      </div>
    </div>
  );
}