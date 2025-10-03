// pages/TermsOfUse.tsx
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonIcon
} from "@ionic/react";
import { callOutline, mailOutline, locationOutline } from "ionicons/icons";
import "./TermsOfUse.css";

export default function TermsOfUse() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab3" text="" />
          </IonButtons>
          <IonTitle className="zone-title">Điều khoản sử dụng</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="terms-card">
          <div className="doc-title">ĐIỀU KHOẢN SỬ DỤNG</div>
          <div className="doc-sub">Có hiệu lực từ ngày 10/10/2024</div>

          {/* 1 */}
          <h3 className="sec-title">1. Điều khoản sử dụng</h3>
          <ul className="bullets">
            <li>Người dùng có trách nhiệm cung cấp thông tin chính xác.</li>
            <li>Không sử dụng ứng dụng cho mục đích trái pháp luật.</li>
            <li>Nhà phát triển có quyền tạm ngưng dịch vụ khi cần.</li>
          </ul>

          {/* 2 */}
          <h3 className="sec-title">2. Chính sách bảo mật (cam kết)</h3>
          <ul className="bullets">
            <li>Không bán hoặc cho thuê dữ liệu cá nhân cho bên thứ ba.</li>
            <li>Chỉ sử dụng dữ liệu để phục vụ mục đích học tập và quản lý sự kiện trong trường.</li>
            <li>Dữ liệu được mã hóa khi truyền tải và lưu trữ an toàn trên hệ thống.</li>
            <li>Người dùng có quyền yêu cầu xem, sửa hoặc xóa dữ liệu bằng cách liên hệ qua email hoặc SĐT hỗ trợ.</li>
          </ul>

          {/* 3 */}
          <h3 className="sec-title">3. Quyền sở hữu trí tuệ</h3>
          <ul className="bullets">
            <li>Mọi nội dung, thiết kế, logo và phần mềm trong ứng dụng Zone57 là tài sản của Nhóm Unicare – Trường Đại học Ngoại Thương.</li>
            <li>Bạn không được phép sao chép, phân phối hoặc sử dụng cho mục đích thương mại mà không có sự cho phép bằng văn bản.</li>
          </ul>

          {/* LIÊN HỆ */}
          <div className="contact-card">
            <div className="contact-title">Mọi thắc mắc vui lòng liên hệ</div>
            <div className="contact-row">
              <IonIcon icon={mailOutline} />
              <a href="mailto:k62.2311510018@ftu.edu.vn">k62.2311510018@ftu.edu.vn</a>
            </div>
            <div className="contact-row">
              <IonIcon icon={callOutline} />
              <a href="tel:0949540626">0949540626</a>
            </div>
            <div className="contact-row">
              <IonIcon icon={locationOutline} />
              <span>Nhóm Unicare, Trường Đại học Ngoại Thương, Hà Nội</span>
            </div>
          </div>

          {/* NOTICE */}
          <div className="ack-box">
            Bằng việc tiếp tục sử dụng ứng dụng, bạn xác nhận đã đọc, hiểu và đồng ý với các điều khoản trên.
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
