import { useState } from "react";
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export default function ClubFeed() {
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, author: "Nguyễn Văn A", title: "Đăng ký tham gia Workshop Start-up",
      content: "Workshop về khởi nghiệp dành cho sinh viên FTU. Đăng ký ngay!",
      likes: 24, comments: 5, isLiked: false },
    { id: 2, author: "Trần Thị B", title: "Ảnh sự kiện tháng 10",
      content: "Những khoảnh khắc đáng nhớ từ sự kiện tháng trước.",
      likes: 42, comments: 12, isLiked: false },
    { id: 3, author: "Lê Văn C", title: "Kế hoạch CLB tuần này",
      content: "Các hoạt động sắp tới của CLB trong tuần này.",
      likes: 18, comments: 3, isLiked: false },
  ]);

  const handleLike = (id: number) =>
    setPosts(ps => ps.map(p =>
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
    ));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
        <IonTitle className="zone-title ion-text-center">Zone57</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="mx-auto max-w-[720px] px-4 py-6">
          <div className="space-y-5">
            {posts.map(post => (
              <Card
                key={post.id}
                className="rounded-[22px] border-2 border-[#2b201c] bg-white p-5 shadow-sm"
              >
                {/* Author + Title + Content */}
                <div className="mb-3">
                  <p className="mb-2 text-[15px] text-[#7a6f6a]">– {post.author}:</p>
                  <h3 className="mb-3 text-[18px] font-semibold leading-snug text-[#c41414]">
                    “{post.title}”
                  </h3>
                  <p className="text-[15px] text-[#2b201c]">{post.content}</p>
                </div>

                <div className="my-3 h-px w-full bg-[#2b201c]/60" />

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3 sm:gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`h-8 px-2 text-[15px] ${
                        post.isLiked ? "text-[#c41414]" : "text-[#7a6f6a]"
                      }`}
                    >
                      <Heart className={`mr-2 h-4 w-4 ${post.isLiked ? "fill-current" : ""}`} />
                      Like ({post.likes})
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-[15px] text-[#7a6f6a]"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Comment ({post.comments})
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-[15px] text-[#7a6f6a]"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
