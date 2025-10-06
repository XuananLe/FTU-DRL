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
import { useRef } from "react";
import { useEffect } from "react";

const CounterRow: React.FC<CounterRowProps> = ({ label, value, onChange, min = 1, max = 5 }) => {
  const handleClick = (num: number) => {
    // If clicking the currently selected value, unselect it (set to 0)
    if (value === num) {
      onChange(0);
    } else {
      onChange(num);
    }
  };

  return (
    <div className="counter-row">
      <span className="counter-label">{label}</span>
      <div className="counter-chips">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
          <div
            key={num}
            className={`counter-chip ${value === num ? "selected" : ""}`}
            onClick={() => handleClick(num)}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function RLAssessmentForm() {
    // ==== UPLOAD STATE ====
    type ProofItem = {
        id: string;
        file: File;
        url: string;       // object URL để preview/mở
        kind: "image" | "pdf" | "other";
    };

    const [proofs, setProofs] = useState<ProofItem[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    function openFilePicker() {
        fileInputRef.current?.click();
    }

    function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;

        const next: ProofItem[] = [];
        const MAX = 10 * 1024 * 1024; // 10MB

        for (const f of files) {
            if (f.size > MAX) {
                // đơn giản: bỏ qua file quá lớn (có thể dùng IonToast thông báo nếu muốn)
                continue;
            }
            const url = URL.createObjectURL(f);
            const kind = f.type.startsWith("image/")
                ? "image"
                : f.type === "application/pdf"
                    ? "pdf"
                    : "other";

            next.push({
                id: `${f.name}-${f.size}-${crypto.randomUUID?.() ?? Math.random()}`,
                file: f,
                url,
                kind,
            });
        }

        setProofs((old) => [...old, ...next]);
        // reset input để lần sau chọn lại cùng file vẫn fire onChange
        e.target.value = "";
    }

    function removeProof(id: string) {
        setProofs((old) => {
            const hit = old.find((p) => p.id === id);
            if (hit) URL.revokeObjectURL(hit.url);
            return old.filter((p) => p.id !== id);
        });
    }

    // nên cleanup khi unmount
    useEffect(() => {
        return () => proofs.forEach((p) => URL.revokeObjectURL(p.url));
    }, [proofs]);

    // small helper UI: 0 1 2 3 4 5+  +  ô nhập chi tiết theo số lần chọn
    function DetailCounterRow({
        value,
        onChange,
        details,
        setDetails,
        max = 5,
        placeholderBase = "Tên hội thảo/cuộc thi"
    }: {
        value: number;
        onChange: (n: number) => void;
        details: string[];
        setDetails: (arr: string[]) => void;
        max?: number;
        placeholderBase?: string;
    }) {
        const opts = [1, 2, 3, 4, 5]; // Remove the 0 option

        const handleClick = (n: number) => {
            // If clicking the currently selected value, unselect it (set to 0)
            if (value === n) {
                onChange(0);
                setDetails([]); // Clear details when unselecting
            } else {
                onChange(n);
                const need = Math.min(n, max);            
                if (need > details.length) {
                    setDetails([...details, ...Array(need - details.length).fill("")]);
                } else {
                    setDetails(details.slice(0, need));
                }
            }
        };

        const updateDetail = (i: number, v: string) => {
            const next = [...details];
            next[i] = v;
            setDetails(next);
        };

        return (
            <>
                <div className="counter-row">
                    {opts.map(n => (
                        <button
                            key={n}
                            className={`chip ${value === n ? "active" : ""}`}
                            onClick={() => handleClick(n)}
                            type="button"
                            title={value === n ? "Bỏ chọn" : `Chọn ${n}`}
                        >
                            {n === 5 ? "5" : n}
                        </button>
                    ))}
                </div>

                {/* hiện ô nhập khi value > 0 */}
                {value > 0 && (
                    <div className="details-wrap">
                        <div className="details-head">Chi tiết sự kiện:</div>
                        {details.map((text, i) => (
                            <IonItem key={i} lines="none" className="detail-item">
                                <IonInput
                                    placeholder={`${placeholderBase} ${i + 1}`}
                                    value={text}
                                    onIonInput={(e) => updateDetail(i, e.detail.value || "")}
                                    className="detail-input"
                                />
                            </IonItem>
                        ))}
                    </div>
                )}
            </>
        );
    }


    const [ht_21, set_ht_21] = useState(0);
    const [ht21Details, setHt21Details] = useState<string[]>([]);

    const [ht_51, set_ht_51] = useState(0);              // 5 điểm/bài
    const [ht51Details, setHt51Details] = useState<string[]>([]);

    const [ht_10, set_ht_10] = useState(0);              // 10 điểm/bài
    const [ht10Details, setHt10Details] = useState<string[]>([]);

    // 1.2 Optional
    const [opt12, setOpt12] = useState(false);
    const [isDiscounted, setIsDiscounted] = useState(false); // ô phụ khi bật 1.2

    // 1.3 KQHT
    // Fixed values - no longer editable
    const gpa = 3.6;
    const credits = 28;

    // 2.x Nội quy
    const [rule_21, set_rule_21] = useState<"ok" | "violate">("ok");
    const [rule_22, set_rule_22] = useState<"ok" | "violate">("ok");

    // 3.x Hoạt động
    const [vhnt, count_vhnt] = useState(0);     // 2đ/lần

    const [tn_th, set_tn_th] = useState(0);     // 2đ/lần
    const [tnThDetails, setTnThDetails] = useState<string[]>([]);   // NEW

    const [tn_ctv, set_tn_ctv] = useState(0);   // 5đ/lần
    const [tnCtvDetails, setTnCtvDetails] = useState<string[]>([]); // NEW

    const [hmndYes, setHmndYes] = useState(false);
    // (nếu không dùng nữa thì bỏ hmnd_checked)


    // 3.3 Phòng chống tệ nạn
    const [pcxn, set_pcxn] = useState<"yes" | "no">("yes");

    // 4.x Công dân
    const [cd_pl, set_cd_pl] = useState<"ok" | "violate">("ok");
    const [cd_xh, set_cd_xh] = useState<"yes" | "no">("yes");

    // 5.x Cán bộ & thành tích
    const [cb_cv, set_cb_cv] = useState<"bt" | "lp" | "tb" | "none">("none");
    const [tt_gk, set_tt_gk] = useState(false);
    const [tt_bk, set_tt_bk] = useState(false);

    // ====== SCORING ======
    const score = useMemo(() => {
        let s = 0;

        // PHẦN 1 (20đ): quy tắc demo theo mô tả
        s += Math.min(ht_21, 5) * 2;
        s += Math.min(ht_51, 5) * 5;
        s += Math.min(ht_10, 5) * 10;
        if (opt12) s += 2; // “tinh thần vượt khó” tối đa 2đ

        // PHẦN 2 (25đ)
        s += (rule_21 === "ok" ? 10 : 0);
        s += (rule_22 === "ok" ? 15 : 0);
        
        if (gpa >= 3.6) {
            s += 15
        } else if (gpa >= 3.2) {
            s += 8 
        } else  {
            s += 4
        }
        // PHẦN 3 (20đ)
        s += Math.min(vhnt, 5) * 2;
        s += Math.min(tn_th, 5) * 2;
        s += Math.min(tn_ctv, 5) * 5;
        if (hmndYes) s += 5;

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
        ht_21, ht_51, ht_10, opt12, gpa,
        rule_21, rule_22, vhnt, tn_th, tn_ctv, hmndYes,
        cd_pl, cd_xh, cb_cv, tt_gk, tt_bk
    ]);

    const rank =
        score >= 90 ? "Xuất sắc" :
            score >= 80 ? "Tốt" :
                score >= 70 ? "Khá" :
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
                        <DetailCounterRow
                            value={ht_21}
                            onChange={set_ht_21}
                            details={ht21Details}
                            setDetails={setHt21Details}
                            placeholderBase="Tên hội thảo/cuộc thi"
                        />
                        <div className="badge-row yellow">5 ĐIỂM / BÀI</div>
                        <div className="desc">- Viết đề tài NCKH, bài đăng kỷ yếu</div>
                        <DetailCounterRow
                            value={ht_51}
                            onChange={set_ht_51}
                            details={ht51Details}
                            setDetails={setHt51Details}
                            placeholderBase="Tên đề tài/bài báo"
                        />
                        <div className="badge-row red">10 ĐIỂM / BÀI</div>
                        <div className="desc">- Trưởng nhóm, bài đăng tạp chí</div>
                        <DetailCounterRow
                            value={ht_10}
                            onChange={set_ht_10}
                            details={ht10Details}
                            setDetails={setHt10Details}
                            placeholderBase="Tên bài báo"
                        />
                    </IonCardContent>
                </IonCard>

                <IonCard className="sheet compact">
                    <div className="subhead">
                        1.2 TINH THẦN VƯỢT KHÓ <small>(2đ) – OPTIONAL</small>
                    </div>
                    <IonCardContent>
                        <div className="custom-checkbox-item" onClick={() => setOpt12(!opt12)}>
                            <div className={`custom-checkbox ${opt12 ? 'checked' : ''}`}>
                                {opt12 && <span className="checkmark">✓</span>}
                            </div>
                            <label className="checkbox-label">
                                Tôi muốn khai báo phần 1.2 (chỉ tick nếu áp dụng)
                            </label>
                        </div>

                        {opt12 && (
                            <div className="custom-checkbox-item" onClick={() => setIsDiscounted(!isDiscounted)}>
                                <div className={`custom-checkbox ${isDiscounted ? 'checked' : ''}`}>
                                    {isDiscounted && <span className="checkmark">✓</span>}
                                </div>
                                <label className="checkbox-label">
                                    Tôi thuộc đối tượng được miễn giảm học phí và có kết quả học tập từ loại khá trở lên
                                </label>
                            </div>
                        )}
                    </IonCardContent>
                </IonCard>

                <IonCard className="sheet compact">
                    <div className="subhead">1.3 KẾT QUẢ HỌC TẬP <small>(10đ)</small></div>
                    <IonCardContent>
                        <div className="kv">
                            <span>Điểm TB:</span>
                            <div className="fixed-value">{gpa}<span className="denominator">/4.0</span></div>
                        </div>
                        <div className="kv">
                            <span>Số tín chỉ:</span>
                            <div className="fixed-value">{credits}</div>
                        </div>
                    </IonCardContent>
                </IonCard>

                {/* PHẦN 2 */}
                <div className="part-title">PHẦN 2: CHẤP HÀNH NỘI QUY <small>(25 điểm)</small></div>

                <IonCard className="sheet compact">
                    <div className="subhead">2.1 VĂN BẢN CHỈ ĐẠO <small>(10đ)</small></div>
                    <IonCardContent>
                        <IonRadioGroup value={rule_21} onIonChange={(e) => set_rule_21(e.detail.value)}>
                            <IonItem className="clean-item radio-item" lines="full">
                                <IonLabel>Chấp hành đầy đủ (10 điểm)</IonLabel>
                                <IonRadio slot="start" value="ok" />
                            </IonItem>
                            <IonItem className="clean-item radio-item" lines="none">
                                <IonLabel>Có vi phạm (0 điểm)</IonLabel>
                                <IonRadio slot="start" value="violate" />
                            </IonItem>
                        </IonRadioGroup>
                    </IonCardContent>
                </IonCard>

                <IonCard className="sheet compact">
                    <div className="subhead">2.2 NỘI QUY NHÀ TRƯỜNG <small>(15đ)</small></div>
                    <IonCardContent>
                        <IonRadioGroup value={rule_22} onIonChange={(e) => set_rule_22(e.detail.value)}>
                            <IonItem className="clean-item radio-item" lines="full">
                                <IonLabel>Chấp hành đầy đủ (15 điểm)</IonLabel>
                                <IonRadio slot="start" value="ok" />
                            </IonItem>
                            <IonItem className="clean-item radio-item" lines="none">
                                <IonLabel>Có vi phạm (0 điểm)</IonLabel>
                                <IonRadio slot="start" value="violate" />
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
                        {/* Tình nguyện thường */}
                        <div className="badge-row green">2 ĐIỂM / LẦN</div>
                        <div className="desc">- Hoạt động tình nguyện thường</div>
                        <DetailCounterRow
                            value={tn_th}
                            onChange={set_tn_th}
                            details={tnThDetails}
                            setDetails={setTnThDetails}
                            placeholderBase="Tên hoạt động tình nguyện"
                        />

                        {/* Cộng tác viên */}
                        <div className="badge-row yellow">5 ĐIỂM / LẦN</div>
                        <div className="desc">- Cộng tác viên</div>
                        <DetailCounterRow
                            value={tn_ctv}
                            onChange={set_tn_ctv}
                            details={tnCtvDetails}
                            setDetails={setTnCtvDetails}
                            placeholderBase="Vai trò và thời gian"
                        />

                        {/* Hiến máu */}
                        <div className="badge-row orange">5 ĐIỂM / LẦN</div>
                        <div className="desc">- Hiến máu nhân đạo</div>

                        <div className="custom-checkbox-item" onClick={() => setHmndYes(!hmndYes)}>
                            <div className={`custom-checkbox ${hmndYes ? 'checked' : ''}`}>
                                {hmndYes && <span className="checkmark">✓</span>}
                            </div>
                            <label className="checkbox-label">
                                Đã tham gia hiến máu nhân đạo (5 điểm)
                            </label>
                        </div>
                    </IonCardContent>
                </IonCard>

                <IonCard className="sheet compact">
                    <div className="subhead">3.3 PHÒNG CHỐNG TỆ NẠN <small>(5đ)</small></div>
                    <IonCardContent>
                        <IonRadioGroup value={pcxn} onIonChange={(e) => set_pcxn(e.detail.value)}>
                            <IonItem className="clean-item radio-item" lines="full">
                                <IonLabel>Tham gia đầy đủ (5 điểm)</IonLabel>
                                <IonRadio slot="start" value="yes" />
                            </IonItem>
                            <IonItem className="clean-item radio-item" lines="none">
                                <IonLabel>Không tham gia (0 điểm)</IonLabel>
                                <IonRadio slot="start" value="no" />
                            </IonItem>
                        </IonRadioGroup>
                    </IonCardContent>
                </IonCard>

                {/* PHẦN 4 */}
                <div className="part-title">PHẦN 4: Ý THỨC CÔNG DÂN <small>(25 điểm)</small></div>

                <IonCard className="sheet compact">
                    <div className="subhead">4.1 CHÍNH SÁCH PHÁP LUẬT <small>(15đ)</small></div>
                    <IonCardContent>
                        <IonRadioGroup value={cd_pl} onIonChange={(e) => set_cd_pl(e.detail.value)}>
                            <IonItem className="clean-item radio-item" lines="full">
                                <IonLabel>Chấp hành đầy đủ (15 điểm)</IonLabel>
                                <IonRadio slot="start" value="ok" />
                            </IonItem>
                            <IonItem className="clean-item radio-item" lines="none">
                                <IonLabel>Có vi phạm (0 điểm)</IonLabel>
                                <IonRadio slot="start" value="violate" />
                            </IonItem>
                        </IonRadioGroup>
                    </IonCardContent>
                </IonCard>

                <IonCard className="sheet compact">
                    <div className="subhead">4.2 HOẠT ĐỘNG XÃ HỘI <small>(10đ)</small></div>
                    <IonCardContent>
                        <IonRadioGroup value={cd_xh} onIonChange={(e) => set_cd_xh(e.detail.value)}>
                            <IonItem className="clean-item radio-item" lines="full">
                                <IonLabel>Tham gia đầy đủ (10 điểm)</IonLabel>
                                <IonRadio slot="start" value="yes" />
                            </IonItem>
                            <IonItem className="clean-item radio-item" lines="none">
                                <IonLabel>Không tham gia (0 điểm)</IonLabel>
                                <IonRadio slot="start" value="no" />
                            </IonItem>
                        </IonRadioGroup>
                    </IonCardContent>
                </IonCard>

                {/* PHẦN 5 */}
                <div className="part-title">PHẦN 5: CÁN BỘ & THÀNH TÍCH <small>(10 điểm)</small></div>

                <IonCard className="sheet compact">
                    <div className="subhead">5.1 CÔNG TÁC CÁN BỘ <small>(10đ)</small></div>
                    <IonCardContent>
                        <IonRadioGroup value={cb_cv} onIonChange={(e) => set_cb_cv(e.detail.value)}>
                            <IonItem className="clean-item radio-item" lines="full">
                                <IonLabel>Bí thư, lớp trưởng, chủ tịch CLB (10đ)</IonLabel>
                                <IonRadio slot="start" value="bt" />
                            </IonItem>
                            <IonItem className="clean-item radio-item" lines="full">
                                <IonLabel>Lớp phó, phó bí thư, phó chủ tịch (6đ)</IonLabel>
                                <IonRadio slot="start" value="lp" />
                            </IonItem>
                            <IonItem className="clean-item radio-item" lines="full">
                                <IonLabel>Trưởng ban CLB, trưởng nhóm (4đ)</IonLabel>
                                <IonRadio slot="start" value="tb" />
                            </IonItem>
                            <IonItem className="clean-item radio-item" lines="none">
                                <IonLabel>Không giữ chức vụ (0đ)</IonLabel>
                                <IonRadio slot="start" value="none" />
                            </IonItem>
                        </IonRadioGroup>
                    </IonCardContent>
                </IonCard>

                <IonCard className="sheet compact">
                    <div className="subhead">5.2 THÀNH TÍCH ĐẶC BIỆT <small>(10đ)</small></div>
                    <IonCardContent>
                        <div className="custom-checkbox-item" onClick={() => set_tt_gk(!tt_gk)}>
                            <div className={`custom-checkbox ${tt_gk ? 'checked' : ''}`}>
                                {tt_gk && <span className="checkmark">✓</span>}
                            </div>
                            <label className="checkbox-label">
                                Có Giấy khen (5 điểm)
                            </label>
                        </div>
                        <div className="custom-checkbox-item" onClick={() => set_tt_bk(!tt_bk)}>
                            <div className={`custom-checkbox ${tt_bk ? 'checked' : ''}`}>
                                {tt_bk && <span className="checkmark">✓</span>}
                            </div>
                            <label className="checkbox-label">
                                Có Bằng khen (10 điểm)
                            </label>
                        </div>
                    </IonCardContent>
                </IonCard>

                {/* Upload minh chứng */}
                <IonCard className="sheet compact">
                    <div className="subhead">
                        <IonIcon icon={documentAttachOutline} /> UPLOAD MINH CHỨNG
                    </div>

                    <IonCardContent>
                        {/* input ẩn */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,application/pdf"
                            style={{ display: "none" }}
                            onChange={handleFilesSelected}
                        />

                        {/* nút mở picker */}
                        <div className="upload-box" role="button" onClick={openFilePicker}>
                            +
                            <br />
                            Tải lên minh chứng
                            <br />
                            <small>Tối đa 10MB/file. Tổng hợp tất cả minh chứng cần thiết</small>
                        </div>

                        {/* danh sách preview */}
                        {proofs.length > 0 && (
                            <div className="proof-grid">
                                {proofs.map((p) => (
                                    <div key={p.id} className="proof-item">
                                        <div className="thumb-wrap">
                                            {p.kind === "image" ? (
                                                <img src={p.url} alt={p.file.name} className="thumb" />
                                            ) : (
                                                <div className="thumb thumb-doc">
                                                    {p.kind === "pdf" ? "PDF" : p.file.type || "FILE"}
                                                </div>
                                            )}
                                        </div>

                                        <div className="proof-meta">
                                            <div className="name" title={p.file.name}>{p.file.name}</div>
                                            <div className="size">
                                                {(p.file.size / 1024 / 1024).toFixed(2)} MB
                                            </div>
                                        </div>

                                        <div className="proof-actions">
                                            <a href={p.url} target="_blank" rel="noreferrer" className="link">
                                                Xem
                                            </a>
                                            <button className="link danger" onClick={() => removeProof(p.id)}>
                                                Xoá
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </IonCardContent>
                </IonCard>

                {/* Tổng kết */}
                <IonCard className="total-card">
                    <IonCardContent className="total-content">
                        <div className="total-row">
                            <IonIcon icon={trophyOutline} />
                            <div className="total-text">
                                <div className="total-title">TỔNG ĐIỂM TỰ ĐỘNG: <b>{score}/100</b></div>
                                <div className="total-sub">XẾP LOẠI: <b>{rank}</b></div>
                            </div>
                        </div>
                        <div className="actions">
                            <IonButton color="medium" fill="outline" className="action-btn">
                                <IonIcon slot="start" icon={alertCircleOutline} />
                                Lưu nháp
                            </IonButton>
                            <IonButton color="success" className="action-btn">
                                <IonIcon slot="start" icon={checkmarkCircleOutline} />
                                Gửi đánh giá
                            </IonButton>
                        </div>
                    </IonCardContent>
                </IonCard>

                <div style={{ height: 16 }} />
            </IonContent>
        </IonPage>
    );
}
