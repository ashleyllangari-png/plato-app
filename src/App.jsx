import { useState, useRef } from "react";

const restaurants = [
  {
    id: 1,
    name: "Nobu Downtown",
    cuisine: "Japanese Fusion",
    price: "$$$$",
    rating: 4.8,
    reviews: 2341,
    vibe: ["Date Night", "Trendy", "Upscale"],
    distance: "0.4 mi",
    city: "New York, NY",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&q=90",
    menuHighlights: ["Black Cod Miso", "Yellowtail Jalapeño", "Wagyu Beef"],
    tag: "🔥 Trending Now",
    description: "World-renowned Japanese fusion with a celebrity chef pedigree. Known for innovative dishes blending Japanese technique with Peruvian influences.",
  },
  {
    id: 2,
    name: "Alma Cocina",
    cuisine: "Mexican",
    price: "$$",
    rating: 4.6,
    reviews: 1892,
    vibe: ["Casual", "Lively", "BYOB"],
    distance: "1.2 mi",
    city: "Brooklyn, NY",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=90",
    menuHighlights: ["Birria Tacos", "Elote Street Corn", "Agua de Jamaica"],
    tag: "⭐ Hidden Gem",
    description: "Authentic street food vibes meets modern Brooklyn energy. Their birria tacos have a cult following — for good reason.",
  },
  {
    id: 3,
    name: "Kin Khao",
    cuisine: "Thai",
    price: "$$$",
    rating: 4.7,
    reviews: 987,
    vibe: ["Cozy", "Foodie Fave", "Unique"],
    distance: "2.0 mi",
    city: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=700&q=90",
    menuHighlights: ["Khao Man Gai", "Chiang Mai Larb", "Thai Tea Panna Cotta"],
    tag: "🌿 Michelin Bib",
    description: "A Michelin Bib Gourmand Thai spot that sources ingredients directly from Thai farms. Every dish tells a story.",
  },
  {
    id: 4,
    name: "Pizzana",
    cuisine: "Neapolitan Pizza",
    price: "$$",
    rating: 4.9,
    reviews: 3210,
    vibe: ["Comfort", "Romantic", "Iconic"],
    distance: "0.8 mi",
    city: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=90",
    menuHighlights: ["Cacio e Pepe Pizza", "Burrata", "Dolce de Latte"],
    tag: "🍕 Fan Fave",
    description: "Neo-Neapolitan pizza perfected over a 48-hour dough fermentation. The crust alone is worth the trip.",
  },
  {
    id: 5,
    name: "Rooh",
    cuisine: "Modern Indian",
    price: "$$$",
    rating: 4.5,
    reviews: 1543,
    vibe: ["Upscale", "Inventive", "Bold Flavors"],
    distance: "1.5 mi",
    city: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&q=90",
    menuHighlights: ["Lamb Chop Masala", "Pani Puri Shots", "Cardamom Kulfi"],
    tag: "✨ New & Buzzy",
    description: "Progressive Indian cuisine meets craft cocktail culture. Expect familiar spices in completely unexpected forms.",
  },
  {
    id: 6,
    name: "Le Crocodile",
    cuisine: "French Bistro",
    price: "$$$",
    rating: 4.7,
    reviews: 876,
    vibe: ["Date Night", "Classic", "Romantic"],
    distance: "3.1 mi",
    city: "New York, NY",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=90",
    menuHighlights: ["Steak Frites", "Onion Soup Gratinée", "Profiteroles"],
    tag: "💎 Editor's Pick",
    description: "A Brooklyn French bistro that feels like a Parisian side street. Zero pretension, all soul — the steak frites are legendary.",
  },
];

const SWIPE_LIMIT = 5;

// ── Color tokens ──────────────────────────────────────────
const C = {
  cream: "#F5F0E8",
  creamDark: "#EDE6D6",
  red: "#8B1A1A",
  redMid: "#A52020",
  redLight: "#C0392B",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  charcoal: "#1C1C1C",
  ink: "#2C2020",
  muted: "#8A7060",
  white: "#FFFFFF",
};

const styles = {
  root: { fontFamily: "'Georgia', 'Times New Roman', serif", background: C.cream, minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", color: C.ink, position: "relative", overflow: "hidden" },
  // header
  header: { padding: "22px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.creamDark}`, paddingBottom: 18 },
  logoWrap: {},
  logoMain: { margin: 0, fontSize: 32, fontWeight: 400, color: C.red, fontStyle: "italic", letterSpacing: 1 },
  logoSub: { margin: 0, fontSize: 10, color: C.muted, letterSpacing: 4, textTransform: "uppercase", fontFamily: "'Arial', sans-serif" },
  // stamp badge
  stamp: { border: `2px solid ${C.red}`, borderRadius: 4, padding: "5px 12px", fontSize: 11, color: C.red, fontFamily: "Arial, sans-serif", letterSpacing: 2, textTransform: "uppercase", position: "relative" },
  // tabs
  tabBar: { display: "flex", borderBottom: `1px solid ${C.creamDark}`, margin: "0 24px" },
  tab: (active) => ({ flex: 1, padding: "14px 0", border: "none", background: "transparent", cursor: "pointer", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Arial, sans-serif", color: active ? C.red : C.muted, borderBottom: active ? `2px solid ${C.red}` : "2px solid transparent", transition: "all 0.2s", fontWeight: active ? 700 : 400 }),
  // filters
  filterBar: { display: "flex", gap: 8, padding: "16px 24px 12px", overflowX: "auto", scrollbarWidth: "none" },
  filterChip: (active) => ({ whiteSpace: "nowrap", padding: "7px 18px", borderRadius: 2, border: `1px solid ${active ? C.red : C.muted}`, background: active ? C.red : "transparent", color: active ? C.white : C.muted, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontFamily: "Arial, sans-serif", transition: "all 0.2s" }),
  // card
  cardWrap: { position: "relative", height: 500, margin: "0 16px 16px" },
  cardBg: { position: "absolute", inset: 0, borderRadius: 2, overflow: "hidden", transform: "scale(0.96) translateY(12px)", zIndex: 1, filter: "brightness(0.5)" },
  card: { position: "absolute", inset: 0, borderRadius: 2, overflow: "hidden", cursor: "grab", zIndex: 2, userSelect: "none", boxShadow: "0 8px 40px rgba(28,12,12,0.25)" },
  cardGrad: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,5,5,0.97) 0%, rgba(10,5,5,0.55) 45%, rgba(0,0,0,0.1) 100%)" },
  // card indicators
  likeStamp: (op) => ({ position: "absolute", top: 28, left: 28, border: `3px solid #6aad6a`, borderRadius: 3, padding: "6px 18px", fontSize: 16, fontWeight: 700, color: "#6aad6a", opacity: op, transform: "rotate(-12deg)", fontFamily: "Arial, sans-serif", letterSpacing: 2, textTransform: "uppercase", background: "rgba(0,0,0,0.3)" }),
  skipStamp: (op) => ({ position: "absolute", top: 28, right: 28, border: `3px solid ${C.redLight}`, borderRadius: 3, padding: "6px 18px", fontSize: 16, fontWeight: 700, color: C.redLight, opacity: op, transform: "rotate(12deg)", fontFamily: "Arial, sans-serif", letterSpacing: 2, textTransform: "uppercase", background: "rgba(0,0,0,0.3)" }),
  // card tag
  cardTag: { position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: C.red, color: C.white, borderRadius: 2, padding: "5px 16px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Arial, sans-serif", whiteSpace: "nowrap" },
  // card content
  cardContent: { position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px 22px" },
  cardName: { margin: 0, fontSize: 26, fontWeight: 400, color: C.white, fontStyle: "italic", marginBottom: 3 },
  cardCuisine: { margin: 0, fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "Arial, sans-serif", marginBottom: 12 },
  dividerGold: { height: 1, background: `linear-gradient(to right, ${C.gold}, transparent)`, marginBottom: 12 },
  vibeRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 },
  vibeTag: { border: "1px solid rgba(201,168,76,0.4)", color: C.goldLight, padding: "4px 12px", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Arial, sans-serif", borderRadius: 1 },
  menuLabel: { fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "Arial, sans-serif", marginBottom: 7 },
  menuRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 },
  menuItem: { background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", color: C.goldLight, padding: "4px 10px", fontSize: 10, letterSpacing: 1, borderRadius: 1, fontFamily: "Arial, sans-serif" },
  previewBtn: { width: "100%", padding: "11px", border: `1px solid rgba(255,255,255,0.25)`, background: "rgba(255,255,255,0.07)", color: C.white, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", fontFamily: "Arial, sans-serif", backdropFilter: "blur(8px)", borderRadius: 1, transition: "all 0.2s" },
  // action btns
  actionRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: 20, padding: "4px 0 20px" },
  actionBtn: (primary) => ({ width: primary ? 68 : 54, height: primary ? 68 : 54, borderRadius: "50%", border: primary ? "none" : `1px solid ${C.muted}`, background: primary ? C.red : "transparent", fontSize: primary ? 24 : 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: primary ? `0 4px 24px rgba(139,26,26,0.35)` : "none", transition: "all 0.2s" }),
  // liked tab
  likedCard: { display: "flex", gap: 0, background: C.white, borderRadius: 2, overflow: "hidden", cursor: "pointer", border: `1px solid ${C.creamDark}`, boxShadow: "0 2px 12px rgba(28,12,12,0.06)", marginBottom: 10 },
  // empty
  empty: { textAlign: "center", padding: "60px 32px", display: "flex", flexDirection: "column", alignItems: "center" },
  emptyIcon: { width: 60, height: 60, borderRadius: "50%", border: `1px solid ${C.creamDark}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontStyle: "italic", color: C.ink, marginBottom: 8 },
  emptyText: { fontSize: 11, color: C.muted, letterSpacing: 1, fontFamily: "Arial, sans-serif", lineHeight: 1.7 },
};

export default function PlatoApp() {
  const [cards, setCards] = useState(restaurants);
  const [liked, setLiked] = useState([]);
  const [swipesLeft, setSwipesLeft] = useState(SWIPE_LIMIT);
  const [activeTab, setActiveTab] = useState("discover");
  const [screen, setScreen] = useState("splash"); // splash | main
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [swipeAnim, setSwipeAnim] = useState(null);
  const [showPremium, setShowPremium] = useState(false);
  const [filter, setFilter] = useState("All");
  const [dragX, setDragX] = useState(0);
  const dragRef = useRef({ startX: 0, isDragging: false });

  const cuisines = ["All", "Japanese", "Mexican", "Thai", "Pizza", "Indian", "French"];
  const visible = cards.filter(r => filter === "All" || r.cuisine.toLowerCase().includes(filter.toLowerCase()));
  const current = visible[0];

  const doSwipe = (dir) => {
    if (swipesLeft <= 0) { setShowPremium(true); return; }
    setSwipeAnim(dir);
    setTimeout(() => {
      const top = visible[0];
      if (dir === "right") setLiked(p => [top, ...p]);
      setCards(p => p.filter(r => r.id !== top.id));
      setSwipesLeft(p => p - 1);
      setSwipeAnim(null);
      setDragX(0);
    }, 350);
  };

  const onDown = (e) => { dragRef.current = { startX: e.clientX, isDragging: true }; };
  const onMove = (e) => { if (dragRef.current.isDragging) setDragX(e.clientX - dragRef.current.startX); };
  const onUp = () => { if (Math.abs(dragX) > 90) doSwipe(dragX > 0 ? "right" : "left"); else setDragX(0); dragRef.current.isDragging = false; };

  const cardStyle = swipeAnim
    ? { transform: swipeAnim === "right" ? "translateX(120%) rotate(18deg)" : "translateX(-120%) rotate(-18deg)", opacity: 0, transition: "all 0.35s ease" }
    : { transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`, transition: dragX === 0 ? "all 0.2s" : "none" };

  const likeOp = Math.max(0, Math.min(1, dragX / 70));
  const skipOp = Math.max(0, Math.min(1, -dragX / 70));

  // ── SPLASH ─────────────────────────────────────────────
  if (screen === "splash") return (
    <div style={{ ...styles.root, background: C.cream, justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      {/* Decorative top border */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: C.red }} />
      
      {/* Stamp logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-block", border: `3px solid ${C.red}`, borderRadius: 6, padding: "28px 36px", position: "relative", marginBottom: 32, boxShadow: `inset 0 0 0 6px ${C.cream}, inset 0 0 0 8px ${C.red}` }}>
          {/* Wavy inner frame hint */}
          <p style={{ margin: "0 0 8px", fontSize: 42, fontStyle: "italic", color: C.red, fontFamily: "'Georgia', serif", letterSpacing: 2 }}>Plato</p>
          <div style={{ width: 80, height: 1, background: C.red, margin: "0 auto 8px" }} />
          <p style={{ margin: 0, fontSize: 9, letterSpacing: 4, textTransform: "uppercase", color: C.red, fontFamily: "Arial, sans-serif" }}>Food Discovery</p>
        </div>
        
        <p style={{ fontSize: 16, color: C.muted, fontStyle: "italic", margin: "0 0 8px", letterSpacing: 0.5 }}>
          "You've swiped for worse..."
        </p>
        <p style={{ fontSize: 10, color: C.muted, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial, sans-serif", margin: 0 }}>
          @eatwithplato
        </p>
      </div>

      {/* CTA */}
      <div style={{ width: "80%", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <button onClick={() => setScreen("main")} style={{ width: "100%", padding: "16px", background: C.red, border: "none", color: C.white, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", fontFamily: "Arial, sans-serif", cursor: "pointer", borderRadius: 2, boxShadow: `0 4px 20px rgba(139,26,26,0.3)` }}>
          Start Eating
        </button>
        <button style={{ background: "transparent", border: `1px solid ${C.muted}`, color: C.muted, padding: "14px", width: "100%", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial, sans-serif", cursor: "pointer", borderRadius: 2 }}>
          Already Have an Account?
        </button>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 6, background: C.red }} />
    </div>
  );

  // ── MAIN APP ───────────────────────────────────────────
  return (
    <div style={styles.root}>
      {/* Top red bar */}
      <div style={{ height: 4, background: C.red, flexShrink: 0 }} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoWrap}>
          <h1 style={styles.logoMain}>Plato</h1>
          <p style={styles.logoSub}>Food Discovery</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ ...styles.stamp, fontSize: 10 }}>📍 NYC</div>
          <div onClick={() => setShowPremium(true)} style={{ ...styles.stamp, background: C.red, color: C.white, borderColor: C.red, cursor: "pointer" }}>Pro ✦</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {[["discover","Discover"],["liked",`Saved (${liked.length})`],["profile","Profile"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={styles.tab(activeTab === id)}>{label}</button>
        ))}
      </div>

      {/* ── DISCOVER ── */}
      {activeTab === "discover" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Filters */}
          <div style={styles.filterBar}>
            {cuisines.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={styles.filterChip(filter === f)}>{f}</button>
            ))}
          </div>

          {/* Swipe counter */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 24px 12px", fontFamily: "Arial, sans-serif" }}>
            <span style={{ fontSize: 10, letterSpacing: 2, color: C.muted, textTransform: "uppercase" }}>{visible.length} nearby</span>
            <span style={{ fontSize: 10, letterSpacing: 2, color: swipesLeft <= 1 ? C.red : C.muted, textTransform: "uppercase" }}>
              {swipesLeft}/{SWIPE_LIMIT} swipes
            </span>
          </div>

          {/* Card stack */}
          <div style={styles.cardWrap}>
            {visible[1] && (
              <div style={styles.cardBg}>
                <img src={visible[1].image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            {current ? (
              <div onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} style={{ ...styles.card, ...cardStyle }}>
                <img src={current.image} alt={current.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={styles.cardGrad} />

                {/* Stamps */}
                <div style={styles.likeStamp(likeOp)}>Yummy ✓</div>
                <div style={styles.skipStamp(skipOp)}>Pass ✗</div>

                {/* Tag */}
                <div style={styles.cardTag}>{current.tag}</div>

                {/* Rating badge */}
                <div style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.55)", border: `1px solid ${C.gold}`, borderRadius: 2, padding: "6px 12px", textAlign: "center", backdropFilter: "blur(8px)" }}>
                  <div style={{ fontSize: 16, color: C.goldLight }}>★ {current.rating}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1, fontFamily: "Arial" }}>{current.reviews.toLocaleString()}</div>
                </div>

                <div style={styles.cardContent}>
                  <h2 style={styles.cardName}>{current.name}</h2>
                  <p style={styles.cardCuisine}>{current.cuisine} · {current.city} · {current.distance} · {current.price}</p>
                  <div style={styles.dividerGold} />
                  
                  <div style={styles.vibeRow}>
                    {current.vibe.map(v => <span key={v} style={styles.vibeTag}>{v}</span>)}
                  </div>

                  <p style={styles.menuLabel}>Menu Highlights</p>
                  <div style={styles.menuRow}>
                    {current.menuHighlights.map(m => <span key={m} style={styles.menuItem}>{m}</span>)}
                  </div>

                  <button onClick={() => { setDetail(current); setShowDetail(true); }} style={styles.previewBtn}>
                    View Full Preview →
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `1px solid ${C.creamDark}`, borderRadius: 2, background: C.white }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🍽️</div>
                <p style={{ fontSize: 18, fontStyle: "italic", color: C.ink, marginBottom: 6 }}>You've seen it all.</p>
                <p style={{ fontSize: 11, color: C.muted, letterSpacing: 1, fontFamily: "Arial", textAlign: "center", padding: "0 32px", marginBottom: 20 }}>Come back tomorrow or upgrade to Pro for unlimited discovery.</p>
                <button onClick={() => { setCards(restaurants); setSwipesLeft(SWIPE_LIMIT); }} style={{ padding: "12px 28px", background: C.red, border: "none", color: C.white, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial", cursor: "pointer", borderRadius: 2 }}>Reset Demo</button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {current && (
            <div style={styles.actionRow}>
              <button onClick={() => doSwipe("left")} style={styles.actionBtn(false)}>✕</button>
              <button onClick={() => doSwipe("right")} style={styles.actionBtn(true)}>♥</button>
            </div>
          )}
        </div>
      )}

      {/* ── LIKED ── */}
      {activeTab === "liked" && (
        <div style={{ flex: 1, padding: "20px 20px", overflowY: "auto" }}>
          {liked.length === 0 ? (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>♥</div>
              <p style={styles.emptyTitle}>No saved spots yet</p>
              <p style={styles.emptyText}>Swipe right on restaurants<br />you want to visit</p>
            </div>
          ) : liked.map(r => (
            <div key={r.id} onClick={() => { setDetail(r); setShowDetail(true); }} style={styles.likedCard}>
              <img src={r.image} alt={r.name} style={{ width: 100, height: 100, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ padding: "14px 16px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <p style={{ margin: 0, fontSize: 15, fontStyle: "italic", color: C.ink }}>{r.name}</p>
                  <span style={{ fontSize: 12, color: C.gold }}>★ {r.rating}</span>
                </div>
                <p style={{ margin: "0 0 8px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: C.muted, fontFamily: "Arial" }}>{r.cuisine} · {r.price}</p>
                <div style={{ display: "flex", gap: 5 }}>
                  {r.vibe.slice(0,2).map(v => <span key={v} style={{ border: `1px solid ${C.creamDark}`, borderRadius: 1, padding: "2px 8px", fontSize: 9, letterSpacing: 1, color: C.muted, fontFamily: "Arial", textTransform: "uppercase" }}>{v}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PROFILE ── */}
      {activeTab === "profile" && (
        <div style={{ flex: 1, padding: "24px 20px", overflowY: "auto" }}>
          {/* Profile header */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: `1px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 12px", color: C.red }}>🍴</div>
            <p style={{ margin: 0, fontSize: 20, fontStyle: "italic", color: C.ink }}>Foodie Explorer</p>
            <p style={{ margin: "4px 0 0", fontSize: 10, letterSpacing: 3, color: C.muted, textTransform: "uppercase", fontFamily: "Arial" }}>Taster Plan · New York City</p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[[liked.length, "Saved", "♥"], [SWIPE_LIMIT - swipesLeft, "Today", "↔"], [swipesLeft, "Left", "◇"]].map(([v, l, i]) => (
              <div key={l} style={{ border: `1px solid ${C.creamDark}`, padding: "16px 8px", textAlign: "center", borderRadius: 2, background: C.white }}>
                <div style={{ fontSize: 16, color: C.red, marginBottom: 4 }}>{i}</div>
                <div style={{ fontSize: 22, fontStyle: "italic", color: C.ink }}>{v}</div>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: C.muted, fontFamily: "Arial", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Swipe bar */}
          <div style={{ border: `1px solid ${C.creamDark}`, borderRadius: 2, padding: 18, marginBottom: 20, background: C.white }}>
            <p style={{ margin: "0 0 12px", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.muted, fontFamily: "Arial" }}>Daily Swipes</p>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              {Array.from({ length: SWIPE_LIMIT }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, background: i < (SWIPE_LIMIT - swipesLeft) ? C.red : C.creamDark, borderRadius: 1 }} />
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 10, letterSpacing: 1, color: C.muted, fontFamily: "Arial" }}>{swipesLeft} of {SWIPE_LIMIT} remaining today</p>
          </div>

          {/* Pricing tiers */}
          <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.muted, fontFamily: "Arial", marginBottom: 12 }}>Our Plans</p>
          {[
            { name: "TASTER", desc: "Free plan — try it out", price: "Free", active: true },
            { name: "FULL PLATE", desc: "Unlimited swipes + trending spots", price: "$7/mo", active: false },
            { name: "CHEF'S TABLE", desc: "Business & partnership plan", price: "On request", active: false },
          ].map(p => (
            <div key={p.name} onClick={() => !p.active && setShowPremium(true)} style={{ border: `1px solid ${p.active ? C.muted : C.red}`, borderRadius: 2, padding: "16px 18px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", background: p.active ? C.white : C.red, cursor: p.active ? "default" : "pointer", transition: "all 0.2s" }}>
              <div>
                <p style={{ margin: "0 0 3px", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial", fontWeight: 700, color: p.active ? C.ink : C.white }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: 11, fontStyle: "italic", color: p.active ? C.muted : "rgba(255,255,255,0.75)" }}>{p.desc}</p>
              </div>
              <p style={{ margin: 0, fontSize: 14, fontStyle: "italic", color: p.active ? C.ink : C.goldLight }}>{p.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {showDetail && detail && (
        <div style={{ position: "fixed", inset: 0, background: C.cream, zIndex: 100, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto", overflowY: "auto" }}>
          <div style={{ height: 4, background: C.red, flexShrink: 0 }} />
          <div style={{ position: "relative", height: 300, flexShrink: 0 }}>
            <img src={detail.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,5,5,0.8) 0%, transparent 60%)" }} />
            <button onClick={() => setShowDetail(false)} style={{ position: "absolute", top: 16, left: 16, background: "rgba(0,0,0,0.5)", border: `1px solid rgba(255,255,255,0.3)`, color: C.white, width: 38, height: 38, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div style={{ position: "absolute", bottom: 20, left: 24 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontStyle: "italic", color: C.white }}>{detail.name}</h2>
              <p style={{ margin: "4px 0 0", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "Arial" }}>{detail.cuisine} · {detail.city}</p>
            </div>
            <div style={{ position: "absolute", bottom: 20, right: 24, textAlign: "right" }}>
              <div style={{ fontSize: 20, color: C.goldLight }}>★ {detail.rating}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: 1, fontFamily: "Arial" }}>{detail.reviews.toLocaleString()} reviews</div>
            </div>
          </div>

          <div style={{ padding: 24 }}>
            <div style={{ height: 1, background: `linear-gradient(to right, ${C.gold}, transparent)`, marginBottom: 20 }} />
            
            <p style={{ fontSize: 14, color: C.muted, fontStyle: "italic", lineHeight: 1.7, marginBottom: 24 }}>{detail.description}</p>

            <p style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: C.muted, fontFamily: "Arial", marginBottom: 10 }}>Vibe</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {[...detail.vibe, detail.price, `📍 ${detail.distance}`].map(v => (
                <span key={v} style={{ border: `1px solid ${C.creamDark}`, padding: "6px 14px", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", fontFamily: "Arial", color: C.muted, borderRadius: 1 }}>{v}</span>
              ))}
            </div>

            <p style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: C.muted, fontFamily: "Arial", marginBottom: 10 }}>Menu Highlights</p>
            {detail.menuHighlights.map(m => (
              <div key={m} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.creamDark}` }}>
                <span style={{ fontSize: 14, fontStyle: "italic", color: C.ink }}>— {m}</span>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button style={{ flex: 1, padding: "14px", border: `1px solid ${C.muted}`, background: "transparent", color: C.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial", cursor: "pointer", borderRadius: 2 }}>📍 Directions</button>
              <button style={{ flex: 1, padding: "14px", background: C.red, border: "none", color: C.white, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial", cursor: "pointer", borderRadius: 2 }}>Reserve Now</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PREMIUM MODAL ── */}
      {showPremium && (
        <div onClick={() => setShowPremium(false)} style={{ position: "fixed", inset: 0, background: "rgba(28,12,12,0.7)", zIndex: 200, display: "flex", alignItems: "flex-end", maxWidth: 430, margin: "0 auto" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.cream, borderRadius: "4px 4px 0 0", padding: "32px 28px 28px", width: "100%", borderTop: `4px solid ${C.red}` }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <p style={{ margin: "0 0 6px", fontSize: 28, fontStyle: "italic", color: C.red }}>Upgrade Your Table</p>
              <p style={{ margin: 0, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.muted, fontFamily: "Arial" }}>Choose your plan</p>
            </div>

            <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, marginBottom: 20 }} />

            {[
              { name: "FULL PLATE", price: "$7/month", perks: ["Unlimited daily swipes", "Trending & exclusive spots", "Personalized AI picks", "Zero ads"] },
              { name: "CHEF'S TABLE", price: "On Request", perks: ["All Full Plate features", "Restaurant partner placement", "Sponsored swipe campaigns", "Dedicated account manager"] },
            ].map((plan, i) => (
              <div key={plan.name} style={{ border: `1px solid ${i === 0 ? C.red : C.creamDark}`, borderRadius: 2, padding: "18px 20px", marginBottom: 12, background: i === 0 ? C.red : C.white }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ margin: 0, fontSize: 12, letterSpacing: 3, fontFamily: "Arial", fontWeight: 700, color: i === 0 ? C.white : C.ink }}>{plan.name}</p>
                  <p style={{ margin: 0, fontSize: 14, fontStyle: "italic", color: i === 0 ? C.goldLight : C.red }}>{plan.price}</p>
                </div>
                {plan.perks.map(p => <p key={p} style={{ margin: "4px 0", fontSize: 11, color: i === 0 ? "rgba(255,255,255,0.8)" : C.muted, fontFamily: "Arial" }}>✦ {p}</p>)}
              </div>
            ))}

            <button onClick={() => setShowPremium(false)} style={{ width: "100%", marginTop: 8, padding: "14px", background: "transparent", border: `1px solid ${C.muted}`, color: C.muted, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Arial", cursor: "pointer", borderRadius: 2 }}>Not Right Now</button>
          </div>
        </div>
      )}
    </div>
  );
}