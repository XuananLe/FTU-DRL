import { IonPage, IonContent, IonToolbar, IonHeader, IonTitle } from "@ionic/react";
import { Card } from "../../components/ui/card";
import { Flag, Trophy, Pin, Calendar, Users, BarChart3 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const eventData = [
  { week: "T1", participants: 12 },
  { week: "T2", participants: 18 },
  { week: "T3", participants: 25 },
  { week: "T4", participants: 22 },
];

export default function ClubDashboard() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
        <IonTitle className="zone-title ion-text-center">Zone57</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="mx-auto max-w-[720px] px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#2b201c]">
              PROFILE <span className="text-[#d01a1a]">CLB</span>
            </h1>
          </div>

          {/* Club Info */}
          <Card className="mb-6 rounded-[22px] border-2 border-[#2b201c] bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d01a1a]/10">
                <Flag className="h-6 w-6 text-[#d01a1a]" />
              </div>
              <h2 className="text-xl font-bold text-[#d01a1a]">CLB Zone57</h2>
            </div>
          </Card>

          {/* Ban chủ nhiệm */}
          <Card className="mb-6 rounded-[22px] border-2 border-[#2b201c] bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[#d01a1a]" />
              <h3 className="text-lg font-semibold text-[#2b201c]">Ban chủ nhiệm</h3>
            </div>
            <div className="space-y-2 text-[15px]">
              <p className="text-[#2b201c]">– Nguyễn Văn A – Chủ nhiệm</p>
              <p className="text-[#2b201c]">– Trần Thị B – Thư ký</p>
            </div>
          </Card>

          {/* Ban sự kiện */}
          <Card className="mb-6 rounded-[22px] border-2 border-[#2b201c] bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Pin className="h-5 w-5 text-[#d01a1a]" />
              <h3 className="text-lg font-semibold text-[#2b201c]">Ban sự kiện</h3>
            </div>
            <div className="space-y-2 text-[15px]">
              <p className="text-[#2b201c]">– Lê Văn C – Trưởng ban</p>
              <p className="text-[#2b201c]">– Nguyễn D – Thành viên</p>
            </div>
          </Card>

          {/* Sự kiện tháng */}
          <Card className="mb-6 rounded-[22px] border-2 border-[#2b201c] bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#d01a1a]" />
              <h3 className="text-lg font-semibold text-[#2b201c]">Sự kiện tháng</h3>
            </div>
            <div className="space-y-2 text-[15px]">
              <p className="text-[#2b201c]">
                – Hội thảo <span className="text-[#d01a1a]">CLB</span> – <span className="text-[#d01a1a]">02/10</span>
              </p>
              <p className="text-[#2b201c]">
                – Workshop Start-up – <span className="text-[#d01a1a]">04/10</span>
              </p>
              <p className="text-[#2b201c]">
                – FTU Marathon – <span className="text-[#d01a1a]">07/10</span>
              </p>
            </div>
          </Card>

          {/* Thống kê */}
          <Card className="mb-8 rounded-[22px] border-2 border-[#2b201c] bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#d01a1a]" />
                <h3 className="text-lg font-semibold text-[#2b201c]">
                  Tổng số người tham gia: <span className="text-[#d01a1a]">55</span>
                </h3>
              </div>

              <div>
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#d01a1a]" />
                  <h4 className="text-base font-medium text-[#2b201c]">Biểu đồ thống kê:</h4>
                </div>

                <div className="mb-4 space-y-1 text-sm text-[#6b615c]">
                  <p>+ Số người tham gia theo tuần</p>
                  <p>+ Số người tham gia theo sự kiện</p>
                </div>

                {/* Chart needs a fixed height inside IonContent */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eventData}>
                      <XAxis dataKey="week" stroke="oklch(0.35 0.02 30)" />
                      <YAxis stroke="oklch(0.35 0.02 30)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(0.99 0.005 50)",
                          border: "1px solid oklch(0.88 0.01 50)",
                          borderRadius: "0.5rem",
                          color: "oklch(0.25 0.02 30)",
                        }}
                      />
                      <Bar dataKey="participants" fill="#c41414" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </IonContent>
    </IonPage>
  );
}
