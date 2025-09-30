import React, { useMemo } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonBadge, IonIcon
} from "@ionic/react";
import {
  peopleCircleOutline, schoolOutline, calendarOutline,
  barChartOutline, arrowUp, arrowDown
} from "ionicons/icons";
import "./Dashboard.css";

/* ------- Mini components (SVG thuần) ------- */
function StatKPI({
  icon, label, value, delta, good
}: { icon: any; label: string; value: string; delta?: number; good?: boolean }) {
  return (
    <IonCard className="kpi">
      <IonCardContent>
        <div className="kpi-row">
          <IonIcon icon={icon} className="kpi-ic" />
          <div className="kpi-meta">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
          </div>
          {delta !== undefined && (
            <IonBadge color={good ? "success" : "danger"} className="kpi-delta">
              <IonIcon icon={good ? arrowUp : arrowDown} />
              <span>{Math.abs(delta)}%</span>
            </IonBadge>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
}

/* Donut (SVG) – nhận percent 0..100 */
function Donut({ percent, label }: { percent: number; label: string }) {
  const p = Math.max(0, Math.min(100, percent));
  const R = 32;
  const C = 2 * Math.PI * R;
  const dash = (p / 100) * C;
  return (
    <div className="donut">
      <svg viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={R} className="donut-bg" />
        <circle cx="40" cy="40" r={R} className="donut-fg"
          strokeDasharray={`${dash} ${C - dash}`} />
        <text x="40" y="44" textAnchor="middle" className="donut-txt">{p}%</text>
      </svg>
      <div className="donut-label">{label}</div>
    </div>
  );
}

/* Bar chart cột nhóm – dữ liệu theo tuần */
function GroupBar({
  categories, series
}: { categories: string[]; series: { name: string; data: number[]; color: string }[] }) {
  const max = Math.max(...series.flatMap(s => s.data), 1);
  return (
    <div className="gbar">
      <div className="gbar-legend">
        {series.map(s => (<span key={s.name}><i style={{background:s.color}}/> {s.name}</span>))}
      </div>
      <div className="gbar-wrap">
        {categories.map((cat, idx) => (
          <div key={cat} className="gbar-group">
            {series.map(s => (
              <div key={s.name} className="gbar-bar"
                style={{ height: `${(s.data[idx] / max) * 100}%`, background: s.color }} />
            ))}
            <div className="gbar-cat">{cat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Line chart đơn giản (SVG) */
function SimpleLine({ points, color="#b30018" }:{points:number[], color?:string}) {
  const max = Math.max(...points, 1);
  const step = 100/(points.length-1);
  const poly = points.map((v,i)=>`${i*step},${40-(v/max)*36}`).join(" ");
  return (
    <div className="line-box">
      <svg viewBox="0 0 100 40" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="2.2" points={poly}/>
      </svg>
    </div>
  );
}

/* Rank list CLB theo số sự kiện/tổng check-in */
function ClubRank({ rows }:{rows:{club:string; events:number; checkins:number}[]}) {
  const max = Math.max(...rows.map(r=>r.events), 1);
  return (
    <div className="rank">
      {rows.map((r,i)=>(
        <div className="rank-row" key={r.club}>
          <div className="rank-name">{i+1}. {r.club}</div>
          <div className="rank-bar">
            <div className="rank-fill" style={{width:`${(r.events/max)*100}%`}}/>
          </div>
          <div className="rank-meta">{r.events} sk / {r.checkins} ck</div>
        </div>
      ))}
    </div>
  );
}

/* -------------- Trang Dashboard -------------- */
export default function Dashboard(){
  // Demo data (có thể lấy từ API sau)
  const data = useMemo(()=>({
    totalStudents: 9800,
    activeStudents: 4120,
    participationRate: 42,  // %
    eventsThisMonth: 37,
    clubsHosting: 18,
    trendAttendance: [120,140,135,160,158,171,180,190,210,205,220,230],
    donutByFaculty: [
      {label:'Kinh tế', pct: 28},
      {label:'Kinh doanh QTE', pct: 24},
      {label:'Tài chính', pct: 22},
      {label:'Ngôn ngữ', pct: 18},
      {label:'Khác', pct: 8},
    ],
    byWeekType: {
      cats: ['W1','W2','W3','W4'],
      series: [
        {name:'Talk/Workshop', data:[7,6,8,9], color:'#b30018'},
        {name:'Cuộc thi',      data:[2,3,2,3], color:'#0b4a83'},
        {name:'Thiện nguyện',  data:[1,2,1,2], color:'#128a43'},
      ]
    },
    clubRank: [
      {club:'CLB Marketing', events:9,  checkins: 1260},
      {club:'CLB Nhà Lãnh Đạo Trẻ', events:8,  checkins: 980},
      {club:'CLB Kinh tế quốc tế', events:7,  checkins: 910},
      {club:'CLB Tiếng Anh', events:6,  checkins: 760},
      {club:'CLB Tình nguyện', events:5,  checkins: 720},
    ]
  }),[]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* KPI hàng đầu */}
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <StatKPI icon={peopleCircleOutline} label="Sinh viên hoạt động"
                       value={`${data.activeStudents.toLocaleString()}`}
                       delta={5} good />
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <StatKPI icon={barChartOutline} label="Tỷ lệ tham gia"
                       value={`${data.participationRate}%`} delta={2} good />
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <StatKPI icon={calendarOutline} label="Sự kiện tháng này"
                       value={`${data.eventsThisMonth}`} delta={-3} />
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Dòng 2: donut + bar/group + line */}
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader><IonCardTitle>Tham gia theo khoa</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <div className="donut-grid">
                    {data.donutByFaculty.map(d=>(
                      <Donut key={d.label} percent={d.pct} label={d.label}/>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="5">
              <IonCard>
                <IonCardHeader><IonCardTitle>Sự kiện theo tuần / loại</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <GroupBar categories={data.byWeekType.cats} series={data.byWeekType.series}/>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="3">
              <IonCard>
                <IonCardHeader><IonCardTitle>Xu hướng check-in</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <SimpleLine points={data.trendAttendance}/>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Dòng 3: leaderboard CLB + tổng quan */}
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader><IonCardTitle>Bảng xếp hạng CLB (sự kiện / check-in)</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <ClubRank rows={data.clubRank}/>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard>
                <IonCardHeader><IonCardTitle>Tổng quan</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <div className="overview">
                    <div><span>Tổng SV</span> <b>{data.totalStudents.toLocaleString()}</b></div>
                    <div><span>CLB tổ chức tháng này</span> <b>{data.clubsHosting}</b></div>
                    <div><span>Điểm trung bình DRL tham gia</span> <b>82/100</b></div>
                    <div><span>Tỉ lệ hoàn thành feedback</span> <b>64%</b></div>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
}
