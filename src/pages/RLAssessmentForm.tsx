import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonIcon,
  IonRadioGroup, IonRadio, IonCheckbox, IonButton, IonInput, IonNote
} from "@ionic/react";
import {
  calendarNumberOutline, idCardOutline, documentAttachOutline,
  trophyOutline, alertCircleOutline, checkmarkCircleOutline
} from "ionicons/icons";
import { useMemo, useState } from "react";
import "./RLAssessmentForm.css";

// small helper UI for “0 1 2 3 4 5+” counter
function CounterRow({
  value, onChange, max = 5,
}: { value: number; onChange: (n: number) => void; max?: number }) {
  const opts = [0,1,2,3,4,5];
  return (
    <div className="counter-row">
      {opts.map(n => (
        <button
          key={n}
          className={`chip ${value===n?'active':''}`}
          onClick={() => onChange(n)}
          type="button"
        >
          {n===5 ? "5+" : n}
        </button>
      ))}
    </div>
  );
}

export default function RLAssessmentForm() {
  // ====== STATE ======
  // 1.1 HỌC THUẬT
  const [ht_21,count_ht_21] = useState(0);  // hội thảo (2đ/lần)
  const [ht_51,count_ht_51] = useState(0);  // viết đề tài (5đ/lần)
  const [ht_10,count_ht_10] = useState(0);  // trưởng nhóm/bài tạp chí (10đ/lần)

  // 1.2 Optional
  const [opt_12,set_opt_12] = useState(false);

  // 1.3 KQHT
  const [gpa,set_gpa] = useState<number>(3.6);
  const [credits,set_credits] = useState<number>(28);

  // 2.x Nội quy
  const [rule_21,set_rule_21] = useState<"ok"|"violate">("ok");
  const [rule_22,set_rule_22] = useState<"ok"|"violate">("ok");

  // 3.x Hoạt động
  const [vhnt,count_vhnt] = useState(0);  // 2đ/lần
  const [tn_th,set_tn_th] = useState(0);  // 2đ/lần
  const [tn_ctv,set_tn_ctv] = useState(0); // 5đ/lần
  const [hmnd,set_hmnd] = useState(0);     // 5đ/lần
  const [hmnd_checked,set_hmnd_checked] = useState(false);

  // 3.3 Phòng chống tệ nạn
  const [pcxn,set_pcxn] = useState<"yes"|"no">("yes");

  // 4.x Công dân
  const [cd_pl,set_cd_pl]   = useState<"ok"|"violate">("ok");
  const [cd_xh,set_cd_xh]   = useState<"yes"|"no">("yes");

  // 5.x Cán bộ & thành tích
  const [cb_cv,set_cb_cv] = useState<"bt"|"lp"|"tb"|"none">("none");
  const [tt_gk,set_tt_gk] = useState(false);
  const [tt_bk,set_tt_bk] = useState(false);

  // ====== SCORING ======
  const score = useMemo(() => {
    let s = 0;

    // PHẦN 1 (20đ): quy tắc demo theo mô tả
    s += Math.min(ht_21,5) * 2;
    s += Math.min(ht_51,5) * 5;
    s += Math.min(ht_10,5) * 10;
    if (opt_12) s += 2; // “tinh thần vượt khó” tối đa 2đ
    // KQHT: quy đổi demo: GPA/4 * 10 (max 10đ)
    s += Math.min(10, Math.round((gpa/4)*10));

    // PHẦN 2 (25đ)
    s += (rule_21 === "ok" ? 10 : 0);
    s += (rule_22 === "ok" ? 15 : 0);

    // PHẦN 3 (20đ)
    s += Math.min(vhnt,5) * 2;
    s += Math.min(tn_th,5) * 2;
    s += Math.min(tn_ctv,5) * 5;
    s += Math.min(hmnd,5) * 5;
    if (hmnd_checked) s += 5; // checkbox “đã tham gia hiến máu ... (5đ)”

    // PHẦN 4 (25đ)
    s += (cd_pl === "ok" ? 15 : 0);
    s += (cd_xh === "yes" ? 10 : 0);

    // PHẦN 5 (10đ)
    s += cb_cv === "bt" ? 10
       : cb_cv === "lp" ? 6
       : cb_cv === "tb" ? 4
       : 0;
    if (tt_gk) s += 5;
    if (tt_bk) s += 10;

    // Tổng trần 100
    return Math.min(100, s);
  }, [
    ht_21, ht_51, ht_10, opt_12, gpa,
    rule_21, rule_22, vhnt, tn_th, tn_ctv, hmnd, hmnd_checked,
    cd_pl, cd_xh, cb_cv, tt_gk, tt_bk
  ]);

  const rank =
    score >= 90 ? "TỐT" :
    score >= 70 ? "KHÁ" :
    score >= 50 ? "TRUNG BÌNH" :
    "YẾU";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/rl-assessment" text="" />
          </IonButtons>
          <IonTitle className="zone-title">Đánh Giá Kết Quả Rèn Luyện</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* Banner thời gian đánh giá */}
        <div className="banner">
          <IonIcon icon={calendarNumberOutline} />
          <div>
            <div className="banner-title">ĐANG TRONG KỲ ĐÁNH GIÁ</div>
            <div className="banner-sub">Thời hạn: 01/12/2024 - 15/12/2024</div>
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <IonCard className="sheet">
          <div className="sheet-head">
            <IonIcon icon={idCardOutline} />
            <span>THÔNG TIN CÁ NHÂN</span>
          </div>
          <IonCardContent>
            <div className="kv"><span>Họ và tên:</span><b>ABCXYZ</b></div>
            <div className="kv"><span>Lớp:</span><b>Anh 01 - TC KDQT - K62</b></div>
            <div className="kv"><span>MSSV:</span><b>2311510018</b></div>
          </IonCardContent>
        </IonCard>

        {/* PHẦN 1 */}
        <div className="part-title">PHẦN 1: Ý THỨC HỌC TẬP <small>(20 điểm)</small></div>

        <IonCard className="sheet compact">
          <div className="subhead">1.1 HOẠT ĐỘNG NCKH, HỌC THUẬT <small>(10đ)</small></div>
          <IonCardContent>
            <div className="badge-row green">2 ĐIỂM / LẦN</div>
            <div className="desc">- Hội thảo NCKH cấp trường, cuộc thi học thuật</div>
            <CounterRow value={ht_21} onChange={count_ht_21} />

            <div className="badge-row yellow">5 ĐIỂM / BÀI</div>
            <div className="desc">- Viết đề tài NCKH, bài đăng kỷ yếu</div>
            <CounterRow value={ht_51} onChange={count_ht_51} />

            <div className="badge-row red">10 ĐIỂM / BÀI</div>
            <div className="desc">- Trưởng nhóm, bài đăng tạp chí</div>
            <CounterRow value={ht_10} onChange={count_ht_10} />
          </IonCardContent>
        </IonCard>

        <IonCard className="sheet compact">
          <div className="subhead">1.2 TINH THẦN VƯỢT KHÓ <small>(2đ) – OPTIONAL</small></div>
          <IonCardContent>
            <IonItem lines="none" className="clean-item">
              <IonCheckbox checked={opt_12} onIonChange={(e)=>set_opt_12(e.detail.checked)}>
                Tôi muốn khai báo phần 1.2 (chỉ tick nếu áp dụng)
              </IonCheckbox>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard className="sheet compact">
          <div className="subhead">1.3 KẾT QUẢ HỌC TẬP <small>(10đ)</small></div>
          <IonCardContent>
            <div className="kv">
              <span>Điểm TB:</span>
              <b><IonInput type="number" inputmode="decimal" value={gpa}
                   onIonInput={(e)=>set_gpa(parseFloat(e.detail.value||"0"))}
                   style={{width:90,textAlign:'right'}} /></b>
              <IonNote slot="end">/ 4.0</IonNote>
            </div>
            <div className="kv">
              <span>Số tín chỉ:</span>
              <b><IonInput type="number" value={credits}
                   onIonInput={(e)=>set_credits(parseInt(e.detail.value||"0"))}
                   style={{width:90,textAlign:'right'}} /></b>
            </div>
          </IonCardContent>
        </IonCard>

        {/* PHẦN 2 */}
        <div className="part-title">PHẦN 2: CHẤP HÀNH NỘI QUY <small>(25 điểm)</small></div>

        <IonCard className="sheet compact">
          <div className="subhead">2.1 VĂN BẢN CHỈ ĐẠO <small>(10đ)</small></div>
          <IonCardContent>
            <IonRadioGroup value={rule_21} onIonChange={(e)=>set_rule_21(e.detail.value)}>
              <IonItem className="clean-item" lines="full">
                <IonLabel>Chấp hành đầy đủ (10 điểm)</IonLabel>
                <IonRadio value="ok" />
              </IonItem>
              <IonItem className="clean-item" lines="none">
                <IonLabel>Có vi phạm (0 điểm)</IonLabel>
                <IonRadio value="violate" />
              </IonItem>
            </IonRadioGroup>
          </IonCardContent>
        </IonCard>

        <IonCard className="sheet compact">
          <div className="subhead">2.2 NỘI QUY NHÀ TRƯỜNG <small>(15đ)</small></div>
          <IonCardContent>
            <IonRadioGroup value={rule_22} onIonChange={(e)=>set_rule_22(e.detail.value)}>
              <IonItem className="clean-item" lines="full">
                <IonLabel>Chấp hành đầy đủ (15 điểm)</IonLabel>
                <IonRadio value="ok" />
              </IonItem>
              <IonItem className="clean-item" lines="none">
                <IonLabel>Có vi phạm (0 điểm)</IonLabel>
                <IonRadio value="violate" />
              </IonItem>
            </IonRadioGroup>
          </IonCardContent>
        </IonCard>

        {/* PHẦN 3 */}
        <div className="part-title">PHẦN 3: HOẠT ĐỘNG <small>(20 điểm)</small></div>

        <IonCard className="sheet compact">
          <div className="subhead">3.1 VĂN HÓA – THỂ THAO <small>(10đ)</small></div>
          <IonCardContent>
            <div className="badge-row green">2 ĐIỂM / LẦN</div>
            <div className="desc">- Tham gia hoạt động văn hóa, văn nghệ, thể thao</div>
            <CounterRow value={vhnt} onChange={count_vhnt} />
          </IonCardContent>
        </IonCard>

        <IonCard className="sheet compact">
          <div className="subhead">3.2 HOẠT ĐỘNG TÌNH NGUYỆN <small>(5đ)</small></div>
          <IonCardContent>
            <div className="badge-row green">2 ĐIỂM / LẦN</div>
            <div className="desc">- Hoạt động tình nguyện thường</div>
            <CounterRow value={tn_th} onChange={set_tn_th} />
            <div className="badge-row yellow">5 ĐIỂM / LẦN</div>
            <div className="desc">- Cộng tác viên</div>
            <CounterRow value={tn_ctv} onChange={set_tn_ctv} />
            <div className="badge-row orange">5 ĐIỂM / LẦN</div>
            <div className="desc">- Hiến máu nhân đạo</div>
            <CounterRow value={hmnd} onChange={set_hmnd} />
            <IonItem lines="none" className="clean-item">
              <IonCheckbox checked={hmnd_checked} onIonChange={(e)=>set_hmnd_checked(e.detail.checked)}>
                Đã tham gia hiến máu nhân đạo (5 điểm)
              </IonCheckbox>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard className="sheet compact">
          <div className="subhead">3.3 PHÒNG CHỐNG TỆ NẠN <small>(5đ)</small></div>
          <IonCardContent>
            <IonRadioGroup value={pcxn} onIonChange={(e)=>set_pcxn(e.detail.value)}>
              <IonItem className="clean-item" lines="full">
                <IonLabel>Tham gia đầy đủ (5 điểm)</IonLabel>
                <IonRadio value="yes" />
              </IonItem>
              <IonItem className="clean-item" lines="none">
                <IonLabel>Không tham gia (0 điểm)</IonLabel>
                <IonRadio value="no" />
              </IonItem>
            </IonRadioGroup>
          </IonCardContent>
        </IonCard>

        {/* PHẦN 4 */}
        <div className="part-title">PHẦN 4: Ý THỨC CÔNG DÂN <small>(25 điểm)</small></div>

        <IonCard className="sheet compact">
          <div className="subhead">4.1 CHÍNH SÁCH PHÁP LUẬT <small>(15đ)</small></div>
          <IonCardContent>
            <IonRadioGroup value={cd_pl} onIonChange={(e)=>set_cd_pl(e.detail.value)}>
              <IonItem className="clean-item" lines="full">
                <IonLabel>Chấp hành đầy đủ (15 điểm)</IonLabel>
                <IonRadio value="ok" />
              </IonItem>
              <IonItem className="clean-item" lines="none">
                <IonLabel>Có vi phạm (0 điểm)</IonLabel>
                <IonRadio value="violate" />
              </IonItem>
            </IonRadioGroup>
          </IonCardContent>
        </IonCard>

        <IonCard className="sheet compact">
          <div className="subhead">4.2 HOẠT ĐỘNG XÃ HỘI <small>(10đ)</small></div>
          <IonCardContent>
            <IonRadioGroup value={cd_xh} onIonChange={(e)=>set_cd_xh(e.detail.value)}>
              <IonItem className="clean-item" lines="full">
                <IonLabel>Tham gia đầy đủ (10 điểm)</IonLabel>
                <IonRadio value="yes" />
              </IonItem>
              <IonItem className="clean-item" lines="none">
                <IonLabel>Không tham gia (0 điểm)</IonLabel>
                <IonRadio value="no" />
              </IonItem>
            </IonRadioGroup>
          </IonCardContent>
        </IonCard>

        {/* PHẦN 5 */}
        <div className="part-title">PHẦN 5: CÁN BỘ & THÀNH TÍCH <small>(10 điểm)</small></div>

        <IonCard className="sheet compact">
          <div className="subhead">5.1 CÔNG TÁC CÁN BỘ <small>(10đ)</small></div>
          <IonCardContent>
            <IonRadioGroup value={cb_cv} onIonChange={(e)=>set_cb_cv(e.detail.value)}>
              <IonItem className="clean-item" lines="full">
                <IonLabel>Bí thư, lớp trưởng, chủ tịch CLB (10đ)</IonLabel>
                <IonRadio value="bt" />
              </IonItem>
              <IonItem className="clean-item" lines="full">
                <IonLabel>Lớp phó, phó bí thư, phó chủ tịch (6đ)</IonLabel>
                <IonRadio value="lp" />
              </IonItem>
              <IonItem className="clean-item" lines="full">
                <IonLabel>Trưởng ban CLB, trưởng nhóm (4đ)</IonLabel>
                <IonRadio value="tb" />
              </IonItem>
              <IonItem className="clean-item" lines="none">
                <IonLabel>Không giữ chức vụ (0đ)</IonLabel>
                <IonRadio value="none" />
              </IonItem>
            </IonRadioGroup>
          </IonCardContent>
        </IonCard>

        <IonCard className="sheet compact">
          <div className="subhead">5.2 THÀNH TÍCH ĐẶC BIỆT <small>(10đ)</small></div>
          <IonCardContent>
            <IonItem className="clean-item" lines="full">
              <IonCheckbox checked={tt_gk} onIonChange={(e)=>set_tt_gk(e.detail.checked)}>
                Có Giấy khen (5 điểm)
              </IonCheckbox>
            </IonItem>
            <IonItem className="clean-item" lines="none">
              <IonCheckbox checked={tt_bk} onIonChange={(e)=>set_tt_bk(e.detail.checked)}>
                Có Bằng khen (10 điểm)
              </IonCheckbox>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Upload minh chứng */}
        <IonCard className="sheet compact">
          <div className="subhead">
            <IonIcon icon={documentAttachOutline} /> UPLOAD MINH CHỨNG
          </div>
          <IonCardContent>
            <div className="upload-box">+<br/>Tải lên minh chứng<br/><small>Tối đa 10MB/file. Tổng hợp tất cả minh chứng cần thiết</small></div>
          </IonCardContent>
        </IonCard>

        {/* Tổng kết */}
        <IonCard className="total-card">
          <IonCardContent>
            <div className="total-row">
              <IonIcon icon={trophyOutline} />
              <div>
                <div className="total-title">TỔNG ĐIỂM TỰ ĐỘNG: <b>{score}/100</b></div>
                <div className="total-sub">XẾP LOẠI: <b>{rank}</b></div>
              </div>
            </div>
            <div className="actions">
              <IonButton color="medium" fill="outline">
                <IonIcon slot="start" icon={alertCircleOutline} />
                Lưu nháp
              </IonButton>
              <IonButton color="success">
                <IonIcon slot="start" icon={checkmarkCircleOutline} />
                Gửi đánh giá
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        <div style={{height:16}} />
      </IonContent>
    </IonPage>
  );
}
