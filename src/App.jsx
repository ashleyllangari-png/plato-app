import { useState, useRef, useEffect } from "react";

const C = {
  cream: "#F5F0E8", creamDark: "#EDE6D6", red: "#8B1A1A", redMid: "#A52020",
  gold: "#C9A84C", goldLight: "#E8C96A", ink: "#2C2020", muted: "#8A7060",
  white: "#FFFFFF", green: "#4A7C59", purple: "#7B5EA7", blue: "#3A7BD5",
};

const TIERS = [
  { id:"nibbler",     label:"Nibbler",      icon:"🍴", min:0,   color:C.muted,   desc:"Just getting started" },
  { id:"regular",     label:"Regular",      icon:"🍽️", min:5,   color:C.green,   desc:"Finding your favorites" },
  { id:"foodie",      label:"Foodie",       icon:"⭐", min:15,  color:C.gold,    desc:"Serious about good food" },
  { id:"connoisseur", label:"Connoisseur",  icon:"💎", min:30,  color:C.purple,  desc:"Refined taste & palette" },
  { id:"gastronome",  label:"Gastronome",   icon:"🎩", min:50,  color:C.blue,    desc:"Sophisticated explorer" },
  { id:"maestro",     label:"Maestro",      icon:"👑", min:75,  color:C.red,     desc:"The ultimate foodie" },
  { id:"legend",      label:"Plato Legend", icon:"🏆", min:100, color:"#B8860B",  desc:"You've tasted it all" },
];

const restaurants = [
  { id:1, name:"Nobu Downtown", cuisine:"Japanese Fusion", price:"$$$$", rating:4.8, reviews:2341, vibe:["Date Night","Trendy","Upscale"], distance:"0.4 mi", city:"New York, NY", image:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=700&q=90", menuHighlights:["Black Cod Miso","Yellowtail Jalapeño","Wagyu Beef"], tag:"🔥 Trending Now", description:"World-renowned Japanese fusion blending Japanese technique with Peruvian influences.", lat:40.7128, lng:-74.013, phone:"(212) 219-0500", hours:"Mon–Sun 12pm–11pm", website:"noburestaurants.com" },
  { id:2, name:"Alma Cocina", cuisine:"Mexican", price:"$$", rating:4.6, reviews:1892, vibe:["Casual","Lively","BYOB"], distance:"1.2 mi", city:"Brooklyn, NY", image:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=700&q=90", menuHighlights:["Birria Tacos","Elote Street Corn","Agua de Jamaica"], tag:"⭐ Hidden Gem", description:"Authentic street food vibes meets modern Brooklyn energy.", lat:40.6892, lng:-73.9442, phone:"(718) 576-3209", hours:"Tue–Sun 11am–10pm", website:"almacocina.com" },
  { id:3, name:"Kin Khao", cuisine:"Thai", price:"$$$", rating:4.7, reviews:987, vibe:["Cozy","Foodie Fave","Unique"], distance:"2.0 mi", city:"San Francisco, CA", image:"https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=700&q=90", menuHighlights:["Khao Man Gai","Chiang Mai Larb","Thai Tea Panna Cotta"], tag:"🌿 Michelin Bib", description:"A Michelin Bib Gourmand Thai spot sourcing ingredients directly from Thai farms.", lat:40.7282, lng:-73.9942, phone:"(415) 362-7456", hours:"Mon–Fri 5pm–10pm", website:"kinkhao.com" },
  { id:4, name:"Pizzana", cuisine:"Neapolitan Pizza", price:"$$", rating:4.9, reviews:3210, vibe:["Comfort","Romantic","Iconic"], distance:"0.8 mi", city:"Los Angeles, CA", image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700&q=90", menuHighlights:["Cacio e Pepe Pizza","Burrata","Dolce de Latte"], tag:"🍕 Fan Fave", description:"Neo-Neapolitan pizza perfected over a 48-hour dough fermentation.", lat:40.7489, lng:-73.968, phone:"(310) 481-7108", hours:"Daily 11am–11pm", website:"pizzana.com" },
  { id:5, name:"Rooh", cuisine:"Modern Indian", price:"$$$", rating:4.5, reviews:1543, vibe:["Upscale","Inventive","Bold"], distance:"1.5 mi", city:"Chicago, IL", image:"https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=700&q=90", menuHighlights:["Lamb Chop Masala","Pani Puri Shots","Cardamom Kulfi"], tag:"✨ New & Buzzy", description:"Progressive Indian cuisine meets craft cocktail culture.", lat:40.7614, lng:-73.9776, phone:"(312) 624-9778", hours:"Mon–Sun 5pm–11pm", website:"roohchicago.com" },
  { id:6, name:"Le Crocodile", cuisine:"French Bistro", price:"$$$", rating:4.7, reviews:876, vibe:["Date Night","Classic","Romantic"], distance:"3.1 mi", city:"New York, NY", image:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=90", menuHighlights:["Steak Frites","Onion Soup Gratinée","Profiteroles"], tag:"💎 Editor's Pick", description:"A Brooklyn French bistro that feels like a Parisian side street.", lat:40.7023, lng:-73.9871, phone:"(718) 628-7068", hours:"Tue–Sun 6pm–11pm", website:"lecrocodilebrooklyn.com" },
];

const FRIENDS = [
  { id:1, name:"Dylan T.", avatar:"👨‍🍳", swiped:[1,3,5], tier:2 },
  { id:2, name:"Sofia M.", avatar:"👩‍🎤", swiped:[1,2,4], tier:3 },
  { id:3, name:"Marcus L.", avatar:"🧑‍💻", swiped:[2,5,6], tier:1 },
  { id:4, name:"Priya K.", avatar:"👩‍🎨", swiped:[3,4,6], tier:4 },
];

const SWIPE_LIMIT = 5;
const getTier = (n) => [...TIERS].reverse().find(t => n >= t.min) || TIERS[0];
const getNext = (n) => TIERS.find(t => t.min > n) || null;

function Stamp({ tier, size=80, earned=true }) {
  const s=size, r=s*0.46, cx=s/2, cy=s/2, teeth=24;
  const pts = Array.from({length:teeth*2},(_,i)=>{
    const a=(i*Math.PI)/teeth, rad=i%2===0?r:r-s*0.055;
    return `${cx+rad*Math.cos(a)},${cy+rad*Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{opacity:earned?1:0.2,filter:earned?"none":"grayscale(1)"}}>
      <polygon points={pts} fill={earned?tier.color:"#ccc"}/>
      <circle cx={cx} cy={cy} r={r*0.72} fill={C.cream}/>
      <circle cx={cx} cy={cy} r={r*0.68} fill="none" stroke={earned?tier.color:"#ccc"} strokeWidth={1.5}/>
      <text x={cx} y={cy-s*0.07} textAnchor="middle" fontSize={s*0.22} dominantBaseline="middle">{tier.icon}</text>
      <text x={cx} y={cy+s*0.18} textAnchor="middle" fontSize={s*0.09} fill={earned?tier.color:"#999"} fontFamily="Arial" letterSpacing="1">{tier.label.toUpperCase()}</text>
    </svg>
  );
}

function MapView({ restaurants, liked, onSelect }) {
  const [sel, setSel] = useState(null);
  const lats=restaurants.map(r=>r.lat), lngs=restaurants.map(r=>r.lng);
  const minLat=Math.min(...lats)-0.02, maxLat=Math.max(...lats)+0.02;
  const minLng=Math.min(...lngs)-0.02, maxLng=Math.max(...lngs)+0.02;
  const W=390, H=260;
  const toX=lng=>((lng-minLng)/(maxLng-minLng))*W;
  const toY=lat=>H-((lat-minLat)/(maxLat-minLat))*H;
  const isLiked=id=>liked.some(l=>l.id===id);
  return (
    <div style={{position:"relative",background:"#EDE8DC",borderBottom:`1px solid ${C.creamDark}`}}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
        <rect width={W} height={H} fill="#EDE8DC"/>
        {[{x:40,y:20,w:80,h:50},{x:160,y:40,w:90,h:45},{x:280,y:70,w:75,h:55},{x:55,y:130,w:85,h:50},{x:195,y:150,w:100,h:55},{x:305,y:170,w:70,h:45}].map((b,i)=>(
          <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#D8D0C0" rx={2}/>
        ))}
        {[40.70,40.72,40.74,40.76].map((lat,i)=>(
          <line key={`h${i}`} x1={0} y1={toY(lat)} x2={W} y2={toY(lat)} stroke="#FFF8EE" strokeWidth={6}/>
        ))}
        {[-74.01,-73.99,-73.97,-73.96].map((lng,i)=>(
          <line key={`v${i}`} x1={toX(lng)} y1={0} x2={toX(lng)} y2={H} stroke="#FFF8EE" strokeWidth={6}/>
        ))}
        {restaurants.map(r=>{
          const x=toX(r.lng), y=toY(r.lat), isSel=sel?.id===r.id, lk=isLiked(r.id);
          return (
            <g key={r.id} onClick={()=>{const n=isSel?null:r; setSel(n); onSelect(n);}} style={{cursor:"pointer"}}>
              {isSel&&<circle cx={x} cy={y} r={22} fill={C.red} opacity={0.15}/>}
              <circle cx={x} cy={y} r={isSel?13:9} fill={lk?C.red:C.white} stroke={lk?C.red:C.muted} strokeWidth={isSel?2.5:1.5}/>
              <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize={isSel?8:7} fill={lk?C.white:C.ink} fontFamily="Arial" fontWeight="700">{r.rating}</text>
              {isSel&&(
                <>
                  <rect x={x-50} y={y-44} width={100} height={28} rx={3} fill={C.red}/>
                  <text x={x} y={y-34} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill={C.white} fontFamily="Georgia" fontStyle="italic">{r.name}</text>
                  <polygon points={`${x-5},${y-16} ${x+5},${y-16} ${x},${y-8}`} fill={C.red}/>
                </>
              )}
            </g>
          );
        })}
        <circle cx={W/2} cy={H/2} r={7} fill={C.gold} stroke={C.white} strokeWidth={2}/>
        <circle cx={W/2} cy={H/2} r={14} fill={C.gold} opacity={0.2}/>
      </svg>
      <div style={{position:"absolute",bottom:8,right:8,background:"rgba(245,240,232,0.92)",border:`1px solid ${C.creamDark}`,borderRadius:2,padding:"5px 10px",display:"flex",flexDirection:"column",gap:3}}>
        {[["●",C.gold,"You"],["●",C.red,"Saved"],["●",C.white,"Nearby"]].map(([i,c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{color:c,fontSize:10,WebkitTextStroke:c===C.white?`0.5px ${C.muted}`:"none"}}>{i}</span>
            <span style={{fontSize:8,letterSpacing:1,color:C.muted,fontFamily:"Arial",textTransform:"uppercase"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservationModal({ restaurant, onClose }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const times = ["5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM"];
  const available = times.filter((_,i)=>i%3!==1);
  const handleConfirm = () => { if(name && date && time) setConfirmed(true); };
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(28,12,12,0.75)",zIndex:300,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.cream,borderRadius:"4px 4px 0 0",padding:"28px 24px 24px",width:"100%",borderTop:`4px solid ${C.red}`,maxHeight:"85vh",overflowY:"auto"}}>
        {!confirmed ? (
          <>
            <div style={{textAlign:"center",marginBottom:20}}>
              <p style={{margin:"0 0 4px",fontSize:22,fontStyle:"italic",color:C.red}}>Reserve a Table</p>
              <p style={{margin:0,fontSize:11,fontStyle:"italic",color:C.muted}}>{restaurant.name}</p>
            </div>
            <div style={{height:1,background:`linear-gradient(to right,transparent,${C.gold},transparent)`,marginBottom:20}}/>

            {/* Date */}
            <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:8}}>Select Date</p>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",padding:"12px",border:`1px solid ${C.creamDark}`,borderRadius:2,background:C.white,fontSize:13,fontFamily:"Georgia",color:C.ink,marginBottom:16,boxSizing:"border-box"}}/>

            {/* Guests */}
            <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:8}}>Guests</p>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {[1,2,3,4,5,6].map(n=>(
                <button key={n} onClick={()=>setGuests(n)} style={{flex:1,padding:"10px 0",border:`1px solid ${guests===n?C.red:C.creamDark}`,background:guests===n?C.red:"transparent",color:guests===n?C.white:C.muted,borderRadius:2,fontSize:13,cursor:"pointer",fontFamily:"Georgia"}}>
                  {n}
                </button>
              ))}
            </div>

            {/* Time */}
            <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:8}}>Available Times</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {times.map(t=>{
                const avail=available.includes(t);
                return (
                  <button key={t} onClick={()=>avail&&setTime(t)} style={{padding:"9px 14px",border:`1px solid ${time===t?C.red:avail?C.creamDark:"transparent"}`,background:time===t?C.red:avail?C.white:"transparent",color:time===t?C.white:avail?C.ink:C.creamDark,borderRadius:2,fontSize:12,cursor:avail?"pointer":"not-allowed",fontFamily:"Georgia",textDecoration:avail?"none":"line-through"}}>
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Name */}
            <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:8}}>Name for Reservation</p>
            <input placeholder="Your name..." value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"12px",border:`1px solid ${C.creamDark}`,borderRadius:2,background:C.white,fontSize:13,fontFamily:"Georgia",color:C.ink,marginBottom:20,boxSizing:"border-box"}}/>

            <div style={{display:"flex",gap:10}}>
              <button onClick={onClose} style={{flex:1,padding:"13px",border:`1px solid ${C.muted}`,background:"transparent",color:C.muted,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>Cancel</button>
              <button onClick={handleConfirm} style={{flex:2,padding:"13px",background:name&&date&&time?C.red:"#ccc",border:"none",color:C.white,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:name&&date&&time?"pointer":"not-allowed",borderRadius:2}}>Confirm Reservation</button>
            </div>
          </>
        ) : (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,marginBottom:16}}>🍽️</div>
            <p style={{fontSize:24,fontStyle:"italic",color:C.red,margin:"0 0 8px"}}>You're all set!</p>
            <p style={{fontSize:13,fontStyle:"italic",color:C.muted,margin:"0 0 20px"}}>{restaurant.name}</p>
            <div style={{background:C.white,border:`1px solid ${C.creamDark}`,borderRadius:2,padding:16,marginBottom:20,textAlign:"left"}}>
              {[["📅 Date",date],["🕐 Time",time],[`👥 Guests`,`${guests} ${guests===1?"person":"people"}`],["👤 Name",name]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.creamDark}`}}>
                  <span style={{fontSize:11,color:C.muted,fontFamily:"Arial"}}>{l}</span>
                  <span style={{fontSize:13,fontStyle:"italic",color:C.ink}}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{fontSize:10,color:C.muted,fontFamily:"Arial",letterSpacing:1,marginBottom:20}}>A confirmation has been sent to your email ✦</p>
            <button onClick={onClose} style={{padding:"13px 32px",background:C.red,border:"none",color:C.white,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlatoApp() {
  const [cards, setCards] = useState(restaurants);
  const [liked, setLiked] = useState([]);
  const [totalSwiped, setTotalSwiped] = useState(0);
  const [swipesLeft, setSwipesLeft] = useState(SWIPE_LIMIT);
  const [activeTab, setActiveTab] = useState("discover");
  const [screen, setScreen] = useState("splash");
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [swipeAnim, setSwipeAnim] = useState(null);
  const [showPremium, setShowPremium] = useState(false);
  const [filter, setFilter] = useState("All");
  const [dragX, setDragX] = useState(0);
  const [mapSel, setMapSel] = useState(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [justEarned, setJustEarned] = useState(null);
  const [showReserve, setShowReserve] = useState(false);
  const [reserveFor, setReserveFor] = useState(null);
  const [friendFilter, setFriendFilter] = useState(null);
  const dragRef = useRef({startX:0,isDragging:false});
  const prevTierRef = useRef(getTier(0));

  const cuisines = ["All","Japanese","Mexican","Thai","Pizza","Indian","French"];
  const visible = cards.filter(r => filter==="All" || r.cuisine.toLowerCase().includes(filter.toLowerCase()));
  const current = visible[0];
  const tier = getTier(totalSwiped);
  const nextTier = getNext(totalSwiped);
  const progress = nextTier ? ((totalSwiped-tier.min)/(nextTier.min-tier.min))*100 : 100;

  // Friend match: restaurants both you and friend liked
  const getMatches = (friend) => liked.filter(r => friend.swiped.includes(r.id));

  const doSwipe = (dir) => {
    if(swipesLeft<=0){setShowPremium(true);return;}
    setSwipeAnim(dir);
    setTimeout(()=>{
      const top=visible[0];
      if(dir==="right") setLiked(p=>[top,...p]);
      const n=totalSwiped+1;
      setCards(p=>p.filter(r=>r.id!==top.id));
      setSwipesLeft(p=>p-1);
      setTotalSwiped(n);
      setSwipeAnim(null);
      setDragX(0);
      const nt=getTier(n);
      if(nt.id!==prevTierRef.current.id){setJustEarned(nt);prevTierRef.current=nt;}
    },350);
  };

  const onDown=(e)=>{dragRef.current={startX:e.clientX,isDragging:true};};
  const onMove=(e)=>{if(dragRef.current.isDragging)setDragX(e.clientX-dragRef.current.startX);};
  const onUp=()=>{if(Math.abs(dragX)>90)doSwipe(dragX>0?"right":"left");else setDragX(0);dragRef.current.isDragging=false;};

  const cardStyle = swipeAnim
    ? {transform:swipeAnim==="right"?"translateX(120%) rotate(18deg)":"translateX(-120%) rotate(-18deg)",opacity:0,transition:"all 0.35s ease"}
    : {transform:`translateX(${dragX}px) rotate(${dragX*0.04}deg)`,transition:dragX===0?"all 0.2s":"none"};
  const likeOp=Math.max(0,Math.min(1,dragX/70));
  const skipOp=Math.max(0,Math.min(1,-dragX/70));

  const btn = (label, action, active=false, small=false) => (
    <button onClick={action} style={{padding:small?"8px 16px":"13px",border:`1px solid ${active?C.red:C.muted}`,background:active?C.red:"transparent",color:active?C.white:C.muted,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2,whiteSpace:"nowrap"}}>
      {label}
    </button>
  );

  // ── SPLASH ──────────────────────────────────────────────
  if(screen==="splash") return (
    <div style={{fontFamily:"'Georgia','Times New Roman',serif",background:C.cream,minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:430,margin:"0 auto",color:C.ink,alignItems:"center",justifyContent:"center",position:"relative"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:6,background:C.red}}/>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{display:"inline-block",border:`3px solid ${C.red}`,borderRadius:6,padding:"28px 36px",marginBottom:28,boxShadow:`inset 0 0 0 6px ${C.cream},inset 0 0 0 8px ${C.red}`}}>
          <p style={{margin:"0 0 8px",fontSize:44,fontStyle:"italic",color:C.red,letterSpacing:2}}>Plato</p>
          <div style={{width:80,height:1,background:C.red,margin:"0 auto 8px"}}/>
          <p style={{margin:0,fontSize:9,letterSpacing:4,textTransform:"uppercase",color:C.red,fontFamily:"Arial"}}>Food Discovery</p>
        </div>
        <p style={{fontSize:16,color:C.muted,fontStyle:"italic",margin:"0 0 6px"}}>"You've swiped for worse..."</p>
        <p style={{fontSize:10,color:C.muted,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",margin:0}}>@eatwithplato</p>
      </div>
      <div style={{width:"80%",display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
        <button onClick={()=>setScreen("main")} style={{width:"100%",padding:"16px",background:C.red,border:"none",color:C.white,fontSize:11,letterSpacing:4,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2,boxShadow:`0 4px 20px rgba(139,26,26,0.3)`}}>Start Eating</button>
        <button style={{background:"transparent",border:`1px solid ${C.muted}`,color:C.muted,padding:"14px",width:"100%",fontSize:10,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>Already Have an Account?</button>
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:6,background:C.red}}/>
    </div>
  );

  return (
    <div style={{fontFamily:"'Georgia','Times New Roman',serif",background:C.cream,minHeight:"100vh",display:"flex",flexDirection:"column",maxWidth:430,margin:"0 auto",color:C.ink,position:"relative",overflow:"hidden"}}>
      <div style={{height:4,background:C.red,flexShrink:0}}/>

      {/* Header */}
      <div style={{padding:"16px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.creamDark}`}}>
        <div>
          <h1 style={{margin:0,fontSize:28,fontWeight:400,color:C.red,fontStyle:"italic",letterSpacing:1}}>Plato</h1>
          <p style={{margin:0,fontSize:9,color:C.muted,letterSpacing:4,textTransform:"uppercase",fontFamily:"Arial"}}>Food Discovery</p>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div onClick={()=>setShowTierModal(true)} style={{cursor:"pointer"}}><Stamp tier={tier} size={40} earned/></div>
          <div onClick={()=>setShowPremium(true)} style={{border:`1px solid ${C.red}`,borderRadius:2,padding:"5px 12px",fontSize:9,color:C.red,fontFamily:"Arial",letterSpacing:2,textTransform:"uppercase",cursor:"pointer"}}>Pro ✦</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.creamDark}`,margin:"0 20px"}}>
        {[["discover","Discover"],["map","Map"],["friends","Friends"],["liked",`Saved (${liked.length})`],["profile","Me"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setActiveTab(id)} style={{flex:1,padding:"11px 0",border:"none",background:"transparent",cursor:"pointer",fontSize:8,letterSpacing:2,textTransform:"uppercase",fontFamily:"Arial",color:activeTab===id?C.red:C.muted,borderBottom:activeTab===id?`2px solid ${C.red}`:"2px solid transparent",fontWeight:activeTab===id?700:400,transition:"all 0.2s"}}>{lbl}</button>
        ))}
      </div>

      {/* ── DISCOVER ── */}
      {activeTab==="discover" && (
        <div style={{flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",gap:7,padding:"12px 20px 8px",overflowX:"auto",scrollbarWidth:"none"}}>
            {cuisines.map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{whiteSpace:"nowrap",padding:"6px 14px",borderRadius:2,border:`1px solid ${filter===f?C.red:C.muted}`,background:filter===f?C.red:"transparent",color:filter===f?C.white:C.muted,fontSize:8,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",fontFamily:"Arial",transition:"all 0.2s"}}>{f}</button>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"0 20px 8px",fontFamily:"Arial"}}>
            <span style={{fontSize:9,letterSpacing:2,color:C.muted,textTransform:"uppercase"}}>{visible.length} nearby</span>
            <span style={{fontSize:9,letterSpacing:2,color:swipesLeft<=1?C.red:C.muted,textTransform:"uppercase"}}>{swipesLeft}/{SWIPE_LIMIT} swipes</span>
          </div>

          <div style={{position:"relative",height:480,margin:"0 14px 12px"}}>
            {visible[1]&&(
              <div style={{position:"absolute",inset:0,borderRadius:2,overflow:"hidden",transform:"scale(0.96) translateY(12px)",zIndex:1,filter:"brightness(0.5)"}}>
                <img src={visible[1].image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
            )}
            {current?(
              <div onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} style={{position:"absolute",inset:0,borderRadius:2,overflow:"hidden",cursor:"grab",zIndex:2,userSelect:"none",boxShadow:"0 8px 40px rgba(28,12,12,0.2)",...cardStyle}}>
                <img src={current.image} alt={current.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(15,5,5,0.97) 0%,rgba(10,5,5,0.5) 45%,rgba(0,0,0,0.05) 100%)"}}/>
                <div style={{position:"absolute",top:26,left:26,border:"3px solid #6aad6a",borderRadius:3,padding:"5px 14px",fontSize:14,fontWeight:700,color:"#6aad6a",opacity:likeOp,transform:"rotate(-12deg)",fontFamily:"Arial",letterSpacing:2,textTransform:"uppercase",background:"rgba(0,0,0,0.3)"}}>Yummy ✓</div>
                <div style={{position:"absolute",top:26,right:26,border:`3px solid ${C.red}`,borderRadius:3,padding:"5px 14px",fontSize:14,fontWeight:700,color:C.red,opacity:skipOp,transform:"rotate(12deg)",fontFamily:"Arial",letterSpacing:2,textTransform:"uppercase",background:"rgba(0,0,0,0.3)"}}>Pass ✗</div>
                <div style={{position:"absolute",top:18,left:"50%",transform:"translateX(-50%)",background:C.red,color:C.white,borderRadius:2,padding:"4px 14px",fontSize:9,letterSpacing:2,textTransform:"uppercase",fontFamily:"Arial",whiteSpace:"nowrap"}}>{current.tag}</div>
                <div style={{position:"absolute",top:18,right:14,background:"rgba(0,0,0,0.55)",border:`1px solid ${C.gold}`,borderRadius:2,padding:"5px 10px",textAlign:"center"}}>
                  <div style={{fontSize:14,color:C.goldLight}}>★ {current.rating}</div>
                  <div style={{fontSize:8,color:"rgba(255,255,255,0.5)",letterSpacing:1,fontFamily:"Arial"}}>{current.reviews.toLocaleString()}</div>
                </div>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"22px 20px 18px"}}>
                  <h2 style={{margin:"0 0 2px",fontSize:22,fontWeight:400,color:C.white,fontStyle:"italic"}}>{current.name}</h2>
                  <p style={{margin:"0 0 8px",fontSize:9,color:"rgba(255,255,255,0.6)",letterSpacing:2,textTransform:"uppercase",fontFamily:"Arial"}}>{current.cuisine} · {current.city} · {current.distance} · {current.price}</p>
                  <div style={{height:1,background:`linear-gradient(to right,${C.gold},transparent)`,marginBottom:8}}/>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:8}}>
                    {current.vibe.map(v=><span key={v} style={{border:"1px solid rgba(201,168,76,0.4)",color:C.goldLight,padding:"3px 9px",fontSize:8,letterSpacing:1,textTransform:"uppercase",fontFamily:"Arial",borderRadius:1}}>{v}</span>)}
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
                    {current.menuHighlights.map(m=><span key={m} style={{background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.25)",color:C.goldLight,padding:"3px 8px",fontSize:8,letterSpacing:1,borderRadius:1,fontFamily:"Arial"}}>{m}</span>)}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{setDetail(current);setShowDetail(true);}} style={{flex:1,padding:"9px",border:"1px solid rgba(255,255,255,0.25)",background:"rgba(255,255,255,0.07)",color:C.white,fontSize:8,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",fontFamily:"Arial",borderRadius:1}}>Preview →</button>
                    <button onClick={()=>{setReserveFor(current);setShowReserve(true);}} style={{flex:1,padding:"9px",border:"none",background:C.red,color:C.white,fontSize:8,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",fontFamily:"Arial",borderRadius:1}}>Reserve 🗓️</button>
                  </div>
                </div>
              </div>
            ):(
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:`1px solid ${C.creamDark}`,borderRadius:2,background:C.white}}>
                <div style={{fontSize:36,marginBottom:10}}>🍽️</div>
                <p style={{fontSize:18,fontStyle:"italic",color:C.ink,marginBottom:6}}>You've seen it all.</p>
                <p style={{fontSize:10,color:C.muted,letterSpacing:1,fontFamily:"Arial",textAlign:"center",padding:"0 32px",marginBottom:18}}>Come back tomorrow or go Pro for unlimited discovery.</p>
                <button onClick={()=>{setCards(restaurants);setSwipesLeft(SWIPE_LIMIT);}} style={{padding:"11px 24px",background:C.red,border:"none",color:C.white,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>Reset Demo</button>
              </div>
            )}
          </div>

          {current&&(
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:22,padding:"2px 0 16px"}}>
              <button onClick={()=>doSwipe("left")} style={{width:54,height:54,borderRadius:"50%",border:`1px solid ${C.muted}`,background:"transparent",fontSize:20,cursor:"pointer",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
              <button onClick={()=>doSwipe("right")} style={{width:66,height:66,borderRadius:"50%",border:"none",background:C.red,fontSize:24,cursor:"pointer",color:C.white,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 24px rgba(139,26,26,0.35)`}}>♥</button>
            </div>
          )}
        </div>
      )}

      {/* ── MAP ── */}
      {activeTab==="map" && (
        <div style={{flex:1,display:"flex",flexDirection:"column"}}>
          <MapView restaurants={restaurants} liked={liked} onSelect={setMapSel}/>
          <div style={{flex:1,overflowY:"auto",padding:"12px 16px"}}>
            <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:10}}>
              {mapSel?`— ${mapSel.name}`:"All Restaurants Nearby"}
            </p>
            {(mapSel?[mapSel]:restaurants).map(r=>(
              <div key={r.id} style={{display:"flex",background:C.white,borderRadius:2,overflow:"hidden",cursor:"pointer",border:`1px solid ${mapSel?.id===r.id?C.red:C.creamDark}`,marginBottom:8,transition:"all 0.2s"}}>
                <img src={r.image} alt={r.name} style={{width:80,height:80,objectFit:"cover",flexShrink:0}}/>
                <div style={{padding:"10px 12px",flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <p style={{margin:0,fontSize:13,fontStyle:"italic",color:C.ink}}>{r.name}</p>
                    <span style={{fontSize:11,color:C.gold}}>★ {r.rating}</span>
                  </div>
                  <p style={{margin:"0 0 6px",fontSize:8,letterSpacing:2,textTransform:"uppercase",color:C.muted,fontFamily:"Arial"}}>{r.cuisine} · {r.price} · {r.distance}</p>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={()=>{setDetail(r);setShowDetail(true);}} style={{padding:"4px 10px",border:`1px solid ${C.creamDark}`,background:"transparent",fontSize:8,letterSpacing:1,color:C.muted,fontFamily:"Arial",cursor:"pointer",borderRadius:1}}>View</button>
                    <button onClick={()=>{setReserveFor(r);setShowReserve(true);}} style={{padding:"4px 10px",border:`1px solid ${C.red}`,background:C.red,fontSize:8,letterSpacing:1,color:C.white,fontFamily:"Arial",cursor:"pointer",borderRadius:1}}>Reserve</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FRIENDS ── */}
      {activeTab==="friends" && (
        <div style={{flex:1,overflowY:"auto",padding:"18px 18px"}}>
          <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:14}}>Friend Matches</p>
          <p style={{fontSize:13,fontStyle:"italic",color:C.muted,marginBottom:16,lineHeight:1.6}}>See which restaurants you and your friends both swiped right on — perfect for choosing where to go together.</p>

          {FRIENDS.map(f=>{
            const matches=getMatches(f);
            const fTier=TIERS[f.tier]||TIERS[0];
            const isOpen=friendFilter===f.id;
            return (
              <div key={f.id} style={{background:C.white,border:`1px solid ${isOpen?C.red:C.creamDark}`,borderRadius:2,marginBottom:10,overflow:"hidden",transition:"all 0.2s"}}>
                <div onClick={()=>setFriendFilter(isOpen?null:f.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer"}}>
                  <div style={{width:44,height:44,borderRadius:"50%",background:C.creamDark,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{f.avatar}</div>
                  <div style={{flex:1}}>
                    <p style={{margin:"0 0 2px",fontSize:14,fontStyle:"italic",color:C.ink}}>{f.name}</p>
                    <p style={{margin:0,fontSize:9,letterSpacing:1,color:C.muted,fontFamily:"Arial"}}>{fTier.icon} {fTier.label}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:18,fontStyle:"italic",color:matches.length>0?C.red:C.muted,fontWeight:400}}>{matches.length}</div>
                    <div style={{fontSize:8,letterSpacing:1,color:C.muted,fontFamily:"Arial",textTransform:"uppercase"}}>match{matches.length!==1?"es":""}</div>
                  </div>
                  <span style={{color:C.muted,fontSize:12}}>{isOpen?"▲":"▼"}</span>
                </div>

                {isOpen&&(
                  <div style={{borderTop:`1px solid ${C.creamDark}`,padding:"12px 16px"}}>
                    {matches.length===0?(
                      <p style={{fontSize:12,fontStyle:"italic",color:C.muted,textAlign:"center",padding:"10px 0"}}>No matches yet — keep swiping! 🍽️</p>
                    ):matches.map(r=>(
                      <div key={r.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.creamDark}`}}>
                        <img src={r.image} alt={r.name} style={{width:50,height:50,objectFit:"cover",borderRadius:1,flexShrink:0}}/>
                        <div style={{flex:1}}>
                          <p style={{margin:"0 0 2px",fontSize:13,fontStyle:"italic",color:C.ink}}>{r.name}</p>
                          <p style={{margin:0,fontSize:8,letterSpacing:1,color:C.muted,fontFamily:"Arial",textTransform:"uppercase"}}>{r.cuisine} · {r.distance}</p>
                        </div>
                        <button onClick={()=>{setReserveFor(r);setShowReserve(true);}} style={{padding:"6px 12px",background:C.red,border:"none",color:C.white,fontSize:8,letterSpacing:2,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:1}}>Book</button>
                      </div>
                    ))}
                    {matches.length>0&&(
                      <button onClick={()=>{setReserveFor(matches[0]);setShowReserve(true);}} style={{width:"100%",marginTop:10,padding:"11px",background:C.red,border:"none",color:C.white,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>
                        Plan a Meal Together 🍽️
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{border:`1px dashed ${C.creamDark}`,borderRadius:2,padding:20,textAlign:"center",marginTop:8}}>
            <p style={{fontSize:18,marginBottom:6}}>➕</p>
            <p style={{fontSize:13,fontStyle:"italic",color:C.muted,margin:"0 0 10px"}}>Invite friends to Plato</p>
            <button style={{padding:"10px 24px",background:C.red,border:"none",color:C.white,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>Share Invite Link</button>
          </div>
        </div>
      )}

      {/* ── LIKED ── */}
      {activeTab==="liked" && (
        <div style={{flex:1,padding:"16px",overflowY:"auto"}}>
          {liked.length===0?(
            <div style={{textAlign:"center",padding:"60px 32px"}}>
              <div style={{width:56,height:56,borderRadius:"50%",border:`1px solid ${C.creamDark}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,margin:"0 auto 14px",color:C.red}}>♥</div>
              <p style={{fontSize:18,fontStyle:"italic",color:C.ink,margin:"0 0 6px"}}>No saved spots yet</p>
              <p style={{fontSize:10,color:C.muted,letterSpacing:1,fontFamily:"Arial",lineHeight:1.7}}>Swipe right on restaurants you want to visit</p>
            </div>
          ):liked.map(r=>(
            <div key={r.id} style={{display:"flex",background:C.white,borderRadius:2,overflow:"hidden",border:`1px solid ${C.creamDark}`,marginBottom:8}}>
              <img src={r.image} alt={r.name} style={{width:85,height:85,objectFit:"cover",flexShrink:0}}/>
              <div style={{padding:"10px 12px",flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <p style={{margin:0,fontSize:13,fontStyle:"italic",color:C.ink}}>{r.name}</p>
                  <span style={{fontSize:11,color:C.gold}}>★ {r.rating}</span>
                </div>
                <p style={{margin:"0 0 6px",fontSize:8,letterSpacing:2,textTransform:"uppercase",color:C.muted,fontFamily:"Arial"}}>{r.cuisine} · {r.price}</p>
                <div style={{display:"flex",gap:5}}>
                  <button onClick={()=>{setDetail(r);setShowDetail(true);}} style={{padding:"4px 10px",border:`1px solid ${C.creamDark}`,background:"transparent",fontSize:8,letterSpacing:1,color:C.muted,fontFamily:"Arial",cursor:"pointer",borderRadius:1}}>View</button>
                  <button onClick={()=>{setReserveFor(r);setShowReserve(true);}} style={{padding:"4px 10px",border:`1px solid ${C.red}`,background:C.red,fontSize:8,letterSpacing:1,color:C.white,fontFamily:"Arial",cursor:"pointer",borderRadius:1}}>Reserve</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PROFILE ── */}
      {activeTab==="profile" && (
        <div style={{flex:1,padding:"20px 18px",overflowY:"auto"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:68,height:68,borderRadius:"50%",border:`1px solid ${C.red}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 10px",color:C.red}}>🍴</div>
            <p style={{margin:0,fontSize:20,fontStyle:"italic",color:C.ink}}>Foodie Explorer</p>
            <p style={{margin:"4px 0 0",fontSize:9,letterSpacing:3,color:C.muted,textTransform:"uppercase",fontFamily:"Arial"}}>Taster Plan · New York City</p>
          </div>

          {/* Tier card */}
          <div style={{border:`1px solid ${C.creamDark}`,borderRadius:2,padding:"16px",background:C.white,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <Stamp tier={tier} size={56} earned/>
              <div style={{flex:1}}>
                <p style={{margin:"0 0 2px",fontSize:14,fontStyle:"italic",color:C.ink}}>{tier.label}</p>
                <p style={{margin:"0 0 6px",fontSize:9,letterSpacing:1,color:C.muted,fontFamily:"Arial"}}>{tier.desc}</p>
                <div style={{height:3,background:C.creamDark,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${progress}%`,background:tier.color,borderRadius:2,transition:"width 0.4s ease"}}/>
                </div>
                {nextTier&&<p style={{margin:"4px 0 0",fontSize:8,letterSpacing:1,color:C.muted,fontFamily:"Arial"}}>{nextTier.min-totalSwiped} swipes to {nextTier.label}</p>}
              </div>
            </div>
            <div style={{height:1,background:C.creamDark,margin:"0 0 12px"}}/>
            <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:10}}>Stamp Collection ({TIERS.length} Total)</p>
            <div style={{display:"flex",justifyContent:"space-around"}}>
              {TIERS.map(t=>(
                <div key={t.id} style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setShowTierModal(true)}>
                  <Stamp tier={t} size={44} earned={totalSwiped>=t.min}/>
                  <p style={{margin:"3px 0 0",fontSize:7,letterSpacing:1,color:totalSwiped>=t.min?t.color:C.muted,fontFamily:"Arial",textTransform:"uppercase"}}>{t.min}+</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
            {[[liked.length,"Saved","♥"],[totalSwiped,"Swiped","↔"],[swipesLeft,"Left","◇"]].map(([v,l,i])=>(
              <div key={l} style={{border:`1px solid ${C.creamDark}`,padding:"12px 6px",textAlign:"center",borderRadius:2,background:C.white}}>
                <div style={{fontSize:14,color:C.red,marginBottom:2}}>{i}</div>
                <div style={{fontSize:20,fontStyle:"italic",color:C.ink}}>{v}</div>
                <div style={{fontSize:8,letterSpacing:2,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Plans */}
          <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:8}}>Our Plans</p>
          {[{name:"TASTER",desc:"Free plan — try it out",price:"Free",active:true},{name:"FULL PLATE",desc:"Unlimited swipes + trending",price:"$7/mo",active:false},{name:"CHEF'S TABLE",desc:"Business & partnerships",price:"On Request",active:false}].map(p=>(
            <div key={p.name} onClick={()=>!p.active&&setShowPremium(true)} style={{border:`1px solid ${p.active?C.muted:C.red}`,borderRadius:2,padding:"13px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",background:p.active?C.white:C.red,cursor:p.active?"default":"pointer"}}>
              <div>
                <p style={{margin:"0 0 2px",fontSize:10,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",fontWeight:700,color:p.active?C.ink:C.white}}>{p.name}</p>
                <p style={{margin:0,fontSize:11,fontStyle:"italic",color:p.active?C.muted:"rgba(255,255,255,0.75)"}}>{p.desc}</p>
              </div>
              <p style={{margin:0,fontSize:13,fontStyle:"italic",color:p.active?C.ink:C.goldLight}}>{p.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {showDetail&&detail&&(
        <div style={{position:"fixed",inset:0,background:C.cream,zIndex:100,display:"flex",flexDirection:"column",maxWidth:430,margin:"0 auto",overflowY:"auto"}}>
          <div style={{height:4,background:C.red,flexShrink:0}}/>
          <div style={{position:"relative",height:260,flexShrink:0}}>
            <img src={detail.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(10,5,5,0.85) 0%,transparent 55%)"}}/>
            <button onClick={()=>setShowDetail(false)} style={{position:"absolute",top:14,left:14,background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.3)",color:C.white,width:34,height:34,borderRadius:"50%",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
            <div style={{position:"absolute",bottom:16,left:20}}>
              <h2 style={{margin:0,fontSize:24,fontStyle:"italic",color:C.white}}>{detail.name}</h2>
              <p style={{margin:"3px 0 0",fontSize:9,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,0.6)",fontFamily:"Arial"}}>{detail.cuisine} · {detail.city}</p>
            </div>
            <div style={{position:"absolute",bottom:16,right:18,textAlign:"right"}}>
              <div style={{fontSize:18,color:C.goldLight}}>★ {detail.rating}</div>
              <div style={{fontSize:8,color:"rgba(255,255,255,0.5)",letterSpacing:1,fontFamily:"Arial"}}>{detail.reviews.toLocaleString()} reviews</div>
            </div>
          </div>
          <div style={{padding:20}}>
            <div style={{height:1,background:`linear-gradient(to right,${C.gold},transparent)`,marginBottom:16}}/>
            <p style={{fontSize:13,color:C.muted,fontStyle:"italic",lineHeight:1.7,marginBottom:18}}>{detail.description}</p>

            {/* Info row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
              {[["📞 Phone",detail.phone],["🕐 Hours",detail.hours],["📍 Distance",detail.distance],["💰 Price",detail.price]].map(([l,v])=>(
                <div key={l} style={{background:C.white,border:`1px solid ${C.creamDark}`,borderRadius:2,padding:"10px 12px"}}>
                  <p style={{margin:"0 0 2px",fontSize:8,letterSpacing:2,textTransform:"uppercase",color:C.muted,fontFamily:"Arial"}}>{l}</p>
                  <p style={{margin:0,fontSize:11,fontStyle:"italic",color:C.ink}}>{v}</p>
                </div>
              ))}
            </div>

            <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:8}}>Vibe</p>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:18}}>
              {detail.vibe.map(v=><span key={v} style={{border:`1px solid ${C.creamDark}`,padding:"5px 12px",fontSize:9,letterSpacing:1,textTransform:"uppercase",fontFamily:"Arial",color:C.muted,borderRadius:1}}>{v}</span>)}
            </div>

            <p style={{fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",marginBottom:8}}>Menu Highlights</p>
            {detail.menuHighlights.map(m=>(
              <div key={m} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.creamDark}`}}>
                <span style={{fontSize:13,fontStyle:"italic",color:C.ink}}>— {m}</span>
              </div>
            ))}

            <div style={{display:"flex",gap:8,marginTop:20}}>
              <button style={{flex:1,padding:"13px",border:`1px solid ${C.muted}`,background:"transparent",color:C.muted,fontSize:8,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>📍 Directions</button>
              <button onClick={()=>{setShowDetail(false);setReserveFor(detail);setShowReserve(true);}} style={{flex:2,padding:"13px",background:C.red,border:"none",color:C.white,fontSize:8,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>🗓️ Reserve a Table</button>
            </div>
          </div>
        </div>
      )}

      {/* ── RESERVATION MODAL ── */}
      {showReserve&&reserveFor&&<ReservationModal restaurant={reserveFor} onClose={()=>setShowReserve(false)}/>}

      {/* ── TIER MODAL ── */}
      {showTierModal&&(
        <div onClick={()=>setShowTierModal(false)} style={{position:"fixed",inset:0,background:"rgba(28,12,12,0.75)",zIndex:200,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.cream,borderRadius:"4px 4px 0 0",padding:"24px 22px 20px",width:"100%",borderTop:`4px solid ${C.red}`,maxHeight:"80vh",overflowY:"auto"}}>
            <p style={{margin:"0 0 4px",fontSize:22,fontStyle:"italic",color:C.red,textAlign:"center"}}>Stamp Collection</p>
            <p style={{margin:"0 0 16px",fontSize:9,letterSpacing:3,textTransform:"uppercase",color:C.muted,fontFamily:"Arial",textAlign:"center"}}>{TIERS.length} stamps to collect</p>
            <div style={{height:1,background:`linear-gradient(to right,transparent,${C.gold},transparent)`,marginBottom:16}}/>
            {TIERS.map(t=>{
              const earned=totalSwiped>=t.min;
              const next=TIERS[TIERS.indexOf(t)+1];
              return (
                <div key={t.id} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:`1px solid ${C.creamDark}`,opacity:earned?1:0.45}}>
                  <Stamp tier={t} size={50} earned={earned}/>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                      <p style={{margin:0,fontSize:13,fontStyle:"italic",color:earned?t.color:C.muted}}>{t.label}</p>
                      <span style={{fontSize:8,letterSpacing:2,fontFamily:"Arial",color:C.muted,textTransform:"uppercase"}}>{t.min}+ swipes</span>
                    </div>
                    <p style={{margin:0,fontSize:10,color:C.muted,fontFamily:"Arial"}}>{t.desc}</p>
                    {earned&&<p style={{margin:"3px 0 0",fontSize:8,color:t.color,fontFamily:"Arial",letterSpacing:1}}>✦ Earned</p>}
                  </div>
                </div>
              );
            })}
            <button onClick={()=>setShowTierModal(false)} style={{marginTop:14,width:"100%",padding:"12px",background:"transparent",border:`1px solid ${C.muted}`,color:C.muted,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>Close</button>
          </div>
        </div>
      )}

      {/* ── PREMIUM MODAL ── */}
      {showPremium&&(
        <div onClick={()=>setShowPremium(false)} style={{position:"fixed",inset:0,background:"rgba(28,12,12,0.72)",zIndex:200,display:"flex",alignItems:"flex-end",maxWidth:430,margin:"0 auto"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.cream,borderRadius:"4px 4px 0 0",padding:"26px 22px 22px",width:"100%",borderTop:`4px solid ${C.red}`}}>
            <p style={{margin:"0 0 4px",fontSize:24,fontStyle:"italic",color:C.red,textAlign:"center"}}>Upgrade Your Table</p>
            <div style={{height:1,background:`linear-gradient(to right,transparent,${C.gold},transparent)`,margin:"12px 0"}}/>
            {[{name:"FULL PLATE",price:"$7/month",perks:["Unlimited daily swipes","Trending & exclusive spots","Personalized AI picks","Zero ads"]},{name:"CHEF'S TABLE",price:"On Request",perks:["All Full Plate features","Restaurant partner placement","Sponsored swipe campaigns","Dedicated account manager"]}].map((p,i)=>(
              <div key={p.name} style={{border:`1px solid ${i===0?C.red:C.creamDark}`,borderRadius:2,padding:"14px 16px",marginBottom:8,background:i===0?C.red:C.white}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <p style={{margin:0,fontSize:10,letterSpacing:3,fontFamily:"Arial",fontWeight:700,color:i===0?C.white:C.ink}}>{p.name}</p>
                  <p style={{margin:0,fontSize:13,fontStyle:"italic",color:i===0?C.goldLight:C.red}}>{p.price}</p>
                </div>
                {p.perks.map(pk=><p key={pk} style={{margin:"2px 0",fontSize:10,color:i===0?"rgba(255,255,255,0.8)":C.muted,fontFamily:"Arial"}}>✦ {pk}</p>)}
              </div>
            ))}
            <button onClick={()=>setShowPremium(false)} style={{width:"100%",marginTop:6,padding:"12px",background:"transparent",border:`1px solid ${C.muted}`,color:C.muted,fontSize:9,letterSpacing:3,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>Not Right Now</button>
          </div>
        </div>
      )}

      {/* ── LEVEL UP TOAST ── */}
      {justEarned&&(
        <div style={{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",background:C.cream,border:`2px solid ${justEarned.color}`,borderRadius:4,padding:"14px 22px",zIndex:300,textAlign:"center",boxShadow:"0 8px 32px rgba(28,12,12,0.2)",minWidth:200}}>
          <Stamp tier={justEarned} size={60} earned/>
          <p style={{margin:"6px 0 2px",fontSize:12,fontStyle:"italic",color:justEarned.color}}>New Stamp Earned!</p>
          <p style={{margin:0,fontSize:9,color:C.muted,fontFamily:"Arial",letterSpacing:1}}>{justEarned.label}</p>
          <button onClick={()=>setJustEarned(null)} style={{marginTop:8,padding:"6px 18px",background:justEarned.color,border:"none",color:C.white,fontSize:8,letterSpacing:2,textTransform:"uppercase",fontFamily:"Arial",cursor:"pointer",borderRadius:2}}>Nice!</button>
        </div>
      )}
    </div>
  );
}
