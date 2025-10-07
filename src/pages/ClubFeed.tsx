import React, { useMemo, useRef, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent,
  IonInfiniteScroll, IonInfiniteScrollContent, IonToast, IonModal, IonHeader as IonModalHeader,
  IonToolbar as IonModalToolbar, IonTitle as IonModalTitle, IonButtons, IonButton, IonIcon,
  IonContent as IonModalContent, IonItem, IonTextarea, useIonToast
} from "@ionic/react";
import {
  thumbsUpOutline, chatbubbleEllipsesOutline, shareSocialOutline, closeOutline, timeOutline
} from "ionicons/icons";
import "./club-feed.css";
import "./club-feed-modal.css";

/* ========= Types ========= */
type Post = {
  id: number;
  club: string;
  ago: string;
  caption: string;
  image?: string;     // placeholder color block if absent
  likes: number;
  liked?: boolean;
  comments: number;
};

/* ========= Seed ========= */
const clubNames = ["CLB A FTU", "CLB B FTU", "CLB C FTU", "CLB D FTU"];
const eventImages = [
  "/assets/events/event-1.jpg",
  "/assets/events/event-2.jpg", 
  "/assets/events/event-3.jpg",
  "/assets/events/event-4.jpg"
];

const captions = [
  "Sự kiện đặc biệt sắp diễn ra vào tuần sau! Đăng ký tham gia ngay để nhận nhiều phần quà hấp dẫn và cơ hội networking với các chuyên gia trong ngành. #ftu #workshop #networking",
  "Chúng mình vừa kết thúc buổi workshop về kỹ năng thuyết trình chuyên nghiệp. Cảm ơn các bạn đã tham gia nhiệt tình! Hãy chia sẻ cảm nghĩ của các bạn về buổi học này nhé.",
  "Thông báo tuyển thành viên mới! CLB chúng mình đang tìm kiếm những bạn sinh viên năng động, sáng tạo để tham gia vào đội ngũ. Hạn chót nộp đơn: 20/10/2025. Điền form tại link trong bio nhé!",
  "Tổng kết hoạt động quý III năm 2025. Một quý với nhiều thành tựu đáng nhớ! Chúc mừng các thành viên đã đồng hành cùng CLB trong suốt thời gian qua.",
  "Hội thảo 'Khởi nghiệp trong kỷ nguyên số' đã diễn ra thành công tốt đẹp. Xin cảm ơn diễn giả và tất cả các bạn đã tham dự!",
  "Thông báo quan trọng: Lịch họp tuần này sẽ được dời sang thứ 5, ngày 09/10/2025. Mong các bạn thành viên sắp xếp thời gian để tham dự đầy đủ nhé."
];

const seedPosts: Post[] = Array.from({ length: 6 }).map((_, i) => {
  const clubIndex = i % clubNames.length;
  const imageIndex = i % eventImages.length;
  const captionIndex = i % captions.length;
  
  return {
    id: i + 1,
    club: clubNames[clubIndex],
    ago: i === 0 ? "1 giờ trước" : i === 1 ? "2 giờ trước" : i === 2 ? "3 giờ trước" : i === 3 ? "1 ngày trước" : `${i} ngày trước`,
    caption: captions[captionIndex],
    image: eventImages[imageIndex],
    likes: 5 + i * 3,
    liked: i % 3 === 0,
    comments: 1 + (i % 5),
  };
});

/* ========= Component ========= */
export default function ClubFeed() {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [hasMore, setHasMore] = useState(true);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const modalRef = useRef<HTMLIonModalElement>(null);
  const [present] = useIonToast();

  const activePost = useMemo(
    () => posts.find(p => p.id === activePostId) || null,
    [activePostId, posts]
  );

  /* ====== Interactions ====== */
  const toggleLike = (id: number) => {
    // Add pulse animation to the like button
    const likeButton = document.querySelector(`.cf-post-${id} .cf-action:first-child`);
    if (likeButton) {
      likeButton.classList.add('pulse-animation');
      setTimeout(() => {
        likeButton.classList.remove('pulse-animation');
      }, 500);
    }
    
    setPosts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const openComments = (id: number) => {
    setActivePostId(id);
    modalRef.current?.present();
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    
    // Update post comment count
    setPosts(prev =>
      prev.map(p => (p.id === activePostId ? { ...p, comments: p.comments + 1 } : p))
    );
    
    // Add the new comment to the DOM
    const commentsContainer = document.querySelector('.cf-comments');
    if (commentsContainer) {
      // Random avatar image
      const randomImageIndex = Math.floor(Math.random() * eventImages.length);
      const newComment = document.createElement('div');
      newComment.className = 'cf-cmt cf-cmt-new';
      newComment.innerHTML = `
        <div 
          class="cf-avatar sm" 
          style="background-image: url(${eventImages[randomImageIndex]}); background-size: cover; background-position: center;"
        ></div>
        <div class="cf-cmt-body">
          <div class="cf-cmt-name">Bạn</div>
          <div class="cf-cmt-text">${commentText}</div>
        </div>
      `;
      commentsContainer.appendChild(newComment);
    }
    
    // Clear comment input
    setCommentText("");
  };

  const sharePost = async (post: Post) => {
    const text = `${post.club}: ${post.caption}`;
    const url = `${location.origin}/post/${post.id}`;
    // Web Share if available
    if (navigator.share) {
      try {
        await navigator.share({ title: post.club, text, url });
        return;
      } catch {
        // ignore cancel
      }
    }
    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(url);
      present({ message: "Đã copy liên kết bài viết", duration: 1400 });
    } catch {
      present({ message: "Không thể chia sẻ", duration: 1400, color: "danger" });
    }
  };

  /* ====== Refresh / Infinite ====== */
  const onRefresh = (e: CustomEvent) => {
    // fake refresh: prepend a new post
    setTimeout(() => {
      // Random club and image
      const clubIndex = Math.floor(Math.random() * clubNames.length);
      const imageIndex = Math.floor(Math.random() * eventImages.length);
      
      setPosts(p => [
        {
          id: Date.now(),
          club: clubNames[clubIndex],
          ago: "vừa xong",
          caption: "Thông báo mới: Chúng mình sắp tổ chức sự kiện giao lưu với sinh viên khoa Ngoại giao! Theo dõi để cập nhật thông tin mới nhất nhé. #ftu #giaoluu #sukien",
          image: eventImages[imageIndex],
          likes: 0,
          comments: 0,
          liked: false,
        },
        ...p,
      ]);
      (e.target as HTMLIonRefresherElement).complete();
    }, 700);
  };

  const loadMore = async (e: CustomEvent<void>) => {
    setTimeout(() => {
      setPosts(prev => [
        ...prev,
        ...Array.from({ length: 2 }).map((_, k) => {
          // Random indices for more variety
          const clubIndex = Math.floor(Math.random() * clubNames.length);
          const imageIndex = Math.floor(Math.random() * eventImages.length);
          const captionIndex = Math.floor(Math.random() * captions.length);
          
          return {
            id: prev.length + k + 1,
            club: clubNames[clubIndex],
            ago: "3 giờ trước",
            caption: captions[captionIndex],
            image: eventImages[imageIndex],
            likes: 2 + Math.floor(Math.random() * 20),
            comments: Math.floor(Math.random() * 5),
            liked: Math.random() > 0.7,
          };
        }),
      ]);
      if (posts.length > 20) setHasMore(false);
      (e.target as HTMLIonInfiniteScrollElement).complete();
    }, 800);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="danger" className="curved-toolbar">
          <IonTitle className="zone-title">Bảng tin</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="cf-content ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent 
            pullingIcon="chevron-down-outline"
            pullingText="Kéo để làm mới"
            refreshingSpinner="circles"
            refreshingText="Đang cập nhật..."
          />
        </IonRefresher>

        <div className="cf-list">
          {posts.map((p) => (
            <article key={p.id} className={`cf-post cf-post-${p.id}`}>
              {/* Header row: avatar + club + time */}
              <div className="cf-row">
                <div 
                  className="cf-avatar" 
                  style={p.image ? {
                    backgroundImage: `url(${p.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : undefined}
                  title={p.club}
                />
                <div className="cf-meta">
                  <div className="cf-club">{p.club}</div>
                  <div className="cf-time">
                    <IonIcon icon={timeOutline} style={{ fontSize: '14px', marginRight: '2px' }} />
                    {p.ago}
                  </div>
                </div>
              </div>

              {/* Caption */}
              <p className="cf-caption">{p.caption}</p>

              {/* Image / placeholder */}
              {p.image ? (
                <div 
                  className="cf-media" 
                  style={{
                    backgroundImage: `url(${p.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              ) : (
                <div className="cf-media" />
              )}

              {/* Actions */}
              <div className="cf-actions">
                <button
                  className={`cf-action ${p.liked ? "is-liked" : ""}`}
                  onClick={() => toggleLike(p.id)}
                >
                  <IonIcon icon={thumbsUpOutline} />
                  <span>Thích</span>
                  {p.likes > 0 && <em className="cf-count">{p.likes}</em>}
                </button>

                <button className="cf-action" onClick={() => openComments(p.id)}>
                  <IonIcon icon={chatbubbleEllipsesOutline} />
                  <span>Bình luận</span>
                  {p.comments > 0 && <em className="cf-count">{p.comments}</em>}
                </button>

                <button className="cf-action" onClick={() => sharePost(p)}>
                  <IonIcon icon={shareSocialOutline} />
                  <span>Chia sẻ</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        <IonInfiniteScroll
          onIonInfinite={loadMore}
          threshold="100px"
          disabled={!hasMore}
        >
          <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Đang tải..." />
        </IonInfiniteScroll>
      </IonContent>

      {/* ===== Comments Bottom Sheet ===== */}
      <IonModal ref={modalRef} initialBreakpoint={0.55} breakpoints={[0, 0.55, 0.85]} className="comments-modal">
        <IonModalHeader>
          <IonModalToolbar className="cf-modal-toolbar">
            <IonButtons slot="start">
              <IonButton onClick={() => modalRef.current?.dismiss()}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
            <IonModalTitle>Bình luận</IonModalTitle>
          </IonModalToolbar>
        </IonModalHeader>
        <IonModalContent className="cf-modal-content">
          {activePost ? (
            <>
              <div className="cf-modal-post">
                <div className="cf-avatar sm" />
                <div className="cf-modal-head">
                  <div className="cf-club">{activePost.club}</div>
                  <div className="cf-time">{activePost.ago}</div>
                </div>
              </div>

              <div className="cf-comments">
                {/* demo comments - more realistic */}
                <div className="cf-cmt">
                  <div 
                    className="cf-avatar sm" 
                    style={{
                      backgroundImage: `url(${eventImages[0]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div className="cf-cmt-body">
                    <div className="cf-cmt-name">Nguyễn Văn A</div>
                    <div className="cf-cmt-text">Sự kiện rất hay! Mong chờ được tham gia.</div>
                  </div>
                </div>
                <div className="cf-cmt">
                  <div 
                    className="cf-avatar sm"
                    style={{
                      backgroundImage: `url(${eventImages[1]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div className="cf-cmt-body">
                    <div className="cf-cmt-name">Trần Thị B</div>
                    <div className="cf-cmt-text">Cho mình hỏi thời gian cụ thể của sự kiện là khi nào vậy?</div>
                  </div>
                </div>
                <div className="cf-cmt">
                  <div 
                    className="cf-avatar sm"
                    style={{
                      backgroundImage: `url(${eventImages[2]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div className="cf-cmt-body">
                    <div className="cf-cmt-name">Lê Hoàng C</div>
                    <div className="cf-cmt-text">Mình đã đăng ký rồi, các bạn nhớ đăng ký sớm nhé vì số lượng có hạn đó!</div>
                  </div>
                </div>
              </div>

              <IonItem className="cf-cmt-input" lines="none">
                <IonTextarea
                  autoGrow
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onIonInput={(e) => setCommentText(e.detail.value || "")}
                />
                <IonButton onClick={addComment} slot="end" strong={true}>
                  Gửi
                </IonButton>
              </IonItem>
            </>
          ) : (
            <div style={{ padding: 16 }}>Đang tải…</div>
          )}
        </IonModalContent>
      </IonModal>
    </IonPage>
  );
}
