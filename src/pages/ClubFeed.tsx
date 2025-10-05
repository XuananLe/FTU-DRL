import React, { useMemo, useRef, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent,
  IonInfiniteScroll, IonInfiniteScrollContent, IonToast, IonModal, IonHeader as IonModalHeader,
  IonToolbar as IonModalToolbar, IonTitle as IonModalTitle, IonButtons, IonButton, IonIcon,
  IonContent as IonModalContent, IonItem, IonTextarea, useIonToast
} from "@ionic/react";
import {
  thumbsUpOutline, chatbubbleEllipsesOutline, shareSocialOutline, closeOutline
} from "ionicons/icons";
import "./club-feed.css";

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
const seedPosts: Post[] = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  club: "CLB A",
  ago: i === 0 ? "1 giờ trước" : `${i + 1} giờ trước`,
  caption: "Caption.....",
  image: "", // leave empty to render placeholder
  likes: 5 + i,
  liked: false,
  comments: 1 + (i % 3),
}));

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
    setPosts(prev =>
      prev.map(p => (p.id === activePostId ? { ...p, comments: p.comments + 1 } : p))
    );
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
      setPosts(p => [
        {
          id: Date.now(),
          club: "CLB A",
          ago: "vừa xong",
          caption: "Caption.....",
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
        ...Array.from({ length: 4 }).map((_, k) => ({
          id: prev.length + k + 1,
          club: "CLB A",
          ago: "3 giờ trước",
          caption: "Caption.....",
          likes: 2 + k,
          comments: k % 2,
          liked: false,
        })),
      ]);
      if (posts.length > 20) setHasMore(false);
      (e.target as HTMLIonInfiniteScrollElement).complete();
    }, 800);
  };

  return (
    <IonPage>
      <IonContent className="cf-content" fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="cf-list">
          {posts.map((p) => (
            <article key={p.id} className="cf-post">
              {/* Header row: avatar + club + time */}
              <div className="cf-row">
                <div className="cf-avatar" />
                <div className="cf-meta">
                  <div className="cf-club">{p.club}</div>
                  <div className="cf-time">{p.ago}</div>
                </div>
              </div>

              {/* Caption */}
              <p className="cf-caption">{p.caption}</p>

              {/* Image / placeholder */}
              <div className="cf-media" />

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
      <IonModal ref={modalRef} initialBreakpoint={0.55} breakpoints={[0, 0.55, 0.85]}>
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
                {/* demo comments */}
                <div className="cf-cmt">
                  <div className="cf-avatar sm" />
                  <div className="cf-cmt-body">
                    <div className="cf-cmt-name">Bạn B</div>
                    <div className="cf-cmt-text">Rất hay!</div>
                  </div>
                </div>
                <div className="cf-cmt">
                  <div className="cf-avatar sm" />
                  <div className="cf-cmt-body">
                    <div className="cf-cmt-name">Bạn C</div>
                    <div className="cf-cmt-text">Cho mình xin ảnh gốc với ạ.</div>
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
