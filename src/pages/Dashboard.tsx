import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonBadge, IonIcon
} from "@ionic/react";
import {
  peopleCircleOutline, barChartOutline, calendarOutline,
  arrowUp, arrowDown
} from "ionicons/icons";
import "./Dashboard.css";

type Series = ApexAxisChartSeries | ApexNonAxisChartSeries;

function KPI({
  icon, label, value, delta, good, spark
}: { icon: any; label: string; value: string; delta?: number; good?: boolean; spark?: number[] }) {
  const sparkOpts = useMemo<ApexCharts.ApexOptions>(() => ({
    chart: { type: "area", sparkline: { enabled: true } }, // sparkline thu gọn
    stroke: { curve: "smooth", width: 2 },
    fill: { opacity: 0.2 },
    tooltip: { enabled: true },
    colors: ["#b30018"],
  }), []);
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
        {spark && (
          <div className="kpi-spark">
            <ReactApexChart height={56} series={[{ data: spark }]} options={sparkOpts} type="area" />
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
}

export default function Dashboard(){
  // —— Demo data (sau này nối API dễ) ——
  const data = useMemo(()=>({
    totalStudents: 9800,
    activeStudents: 4120,
    participationRate: 42,
    eventsThisMonth: 37,
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
        {name:'Talk/Workshop', data:[7,6,8,9]},
        {name:'Cuộc thi',      data:[2,3,2,3]},
        {name:'Thiện nguyện',  data:[1,2,1,2]},
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

  // —— Chart options —— (ApexCharts docs: donut/stacked/area/sparkline) :contentReference[oaicite:1]{index=1}
  const radialOptions: ApexCharts.ApexOptions = {
    chart: { type: "radialBar" },
    plotOptions: {
      radialBar: {
        hollow: { size: "58%" },
        track: { background: "#eee" },
        dataLabels: {
          value: { fontSize: "16px", fontWeight: 800, color: "#b30018" },
          name: { offsetY: 20, show: false }
        }
      }
    },
    labels: [""],
    colors: ["#b30018"],
    tooltip: { enabled: true }
  };

  const stackedOptions: ApexCharts.ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: "36%", borderRadius: 4 } },
    xaxis: { categories: data.byWeekType.cats },
    yaxis: { title: { text: "Sự kiện" } },
    legend: { show: true, position: "top" },
    colors: ["#b30018", "#0b4a83", "#128a43"],
    tooltip: {
      shared: true,
      intersect: false  
    },
  };

  const areaOptions: ApexCharts.ApexOptions = {
    chart: { type: "area", toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    fill: { type: "gradient", gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    tooltip: { enabled: true },
    colors: ["#b30018"],
  };

  const clubBarOptions: ApexCharts.ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, barHeight: "46%", borderRadius: 4 } },
    xaxis: { categories: data.clubRank.map(r => r.club) },
    dataLabels: { enabled: false },
    colors: ["#b30018"],
    grid: { borderColor: "#eee" },
    tooltip: { y: { formatter: (v: number, opts) => {
      const r = data.clubRank[opts.dataPointIndex];
      return `${r.events} sự kiện / ${r.checkins} check-in`;
    }}},
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* KPI */}
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <KPI
                icon={peopleCircleOutline}
                label="Sinh viên hoạt động"
                value={data.activeStudents.toLocaleString()}
                delta={5} good
                spark={[80,90,85,100,110,140,160]}
              />
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <KPI
                icon={barChartOutline}
                label="Tỷ lệ tham gia"
                value={`${data.participationRate}%`}
                delta={2} good
                spark={[28,30,32,35,38,40,42]}
              />
            </IonCol>
            <IonCol size="12" sizeMd="4">
              <KPI
                icon={calendarOutline}
                label="Sự kiện tháng này"
                value={`${data.eventsThisMonth}`}
                delta={-3}
                spark={[34,30,35,32,31,38,37]}
              />
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Dòng 2 */}
        <IonGrid>
          <IonRow>
            {/* Radial donuts theo khoa */}
            <IonCol size="12" sizeLg="4">
              <IonCard>
                <IonCardHeader><IonCardTitle>Tham gia theo khoa</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <div className="donut-grid">
                    {data.donutByFaculty.map(d => (
                      <div key={d.label} className="donut-cell">
                        <ReactApexChart
                          type="radialBar"
                          height={140}
                          options={radialOptions}
                          series={[d.pct as unknown as Series]}
                        />
                        <div className="donut-label">{d.label}</div>
                      </div>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Stacked column theo tuần/loại */}
            <IonCol size="12" sizeLg="5">
              <IonCard>
                <IonCardHeader><IonCardTitle>Sự kiện theo tuần / loại</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <ReactApexChart
                    type="bar"
                    height={260}
                    options={stackedOptions}
                    series={data.byWeekType.series as unknown as Series}
                  />
                </IonCardContent>
              </IonCard>
            </IonCol>

            {/* Xu hướng check-in */}
            <IonCol size="12" sizeLg="3">
              <IonCard>
                <IonCardHeader><IonCardTitle>Xu hướng check-in</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <ReactApexChart
                    type="area"
                    height={260}
                    options={areaOptions}
                    series={[{ name: "Check-in", data: data.trendAttendance }] as unknown as Series}
                  />
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Dòng 3: leaderboard + tổng quan */}
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeLg="7">
              <IonCard>
                <IonCardHeader><IonCardTitle>Bảng xếp hạng CLB (sự kiện / check-in)</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <ReactApexChart
                    type="bar"
                    height={320}
                    options={clubBarOptions}
                    series={[{ name: "Sự kiện", data: data.clubRank.map(r=>r.events) }]}
                  />
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeLg="5">
              <IonCard>
                <IonCardHeader><IonCardTitle>Tổng quan</IonCardTitle></IonCardHeader>
                <IonCardContent>
                  <div className="overview">
                    <div><span>Tổng SV</span> <b>{data.totalStudents.toLocaleString()}</b></div>
                    <div><span>CLB tổ chức tháng này</span> <b>18</b></div>
                    <div><span>Điểm TB DRL tham gia</span> <b>82/100</b></div>
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
