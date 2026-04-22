import { useState, useEffect } from "react";

/* ── THEME ── */
const C = {
  bg:"#F5F5F5", white:"#FFFFFF", pri:"#6B5CE7", priL:"#EDE9FF", priD:"#3D2FAB",
  navy:"#1C1636", mid:"#7A7591", lite:"#C4BFD8", border:"#E5E0F5",
  green:"#4CAF82", greenL:"#E6F7EE", amber:"#E8963A", amberL:"#FEF3E6",
  red:"#E05A5A", redL:"#FDECEA", shadow:"0 4px 20px rgba(107,92,231,.10)",
  shadowSm:"0 2px 10px rgba(107,92,231,.07)",
};
const card = {background:C.white,borderRadius:22,padding:"18px 16px",margin:"10px 16px",boxShadow:C.shadow};
const inp  = {width:"100%",padding:"12px 14px",borderRadius:12,border:`1.5px solid ${C.border}`,
              fontSize:14,color:C.navy,background:"#FAF9FF",boxSizing:"border-box",outline:"none",fontFamily:"inherit"};

const KJ = 4.184;
const todayKey = () => new Date().toISOString().slice(0,10);
const isCombo  = f => f.warn==="combo" || (f.fat>=10 && f.sug>=15);

const S = {
  async get(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}},
  async set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

/* ── FOOD DB ── */
const DB = [
  {id:1,n:"白米饭",kcal:116,fat:0.3,sug:25.6,cat:"🍚 主食"},{id:2,n:"糙米饭",kcal:111,fat:0.9,sug:23,cat:"🍚 主食"},
  {id:3,n:"白面条(煮)",kcal:138,fat:0.5,sug:28,cat:"🍚 主食"},{id:4,n:"馒头",kcal:223,fat:1,sug:46,cat:"🍚 主食"},
  {id:5,n:"白面包",kcal:265,fat:3.2,sug:49,cat:"🍚 主食"},{id:6,n:"全麦面包",kcal:247,fat:3.4,sug:42,cat:"🍚 主食"},
  {id:7,n:"燕麦片(干)",kcal:389,fat:6.9,sug:66,cat:"🍚 主食"},{id:8,n:"炒饭",kcal:163,fat:5,sug:26,cat:"🍚 主食"},
  {id:9,n:"包子(猪肉)",kcal:226,fat:8,sug:28,cat:"🍚 主食"},{id:10,n:"饺子(猪肉)",kcal:237,fat:9.5,sug:29,cat:"🍚 主食"},
  {id:11,n:"鸡胸肉(水煮)",kcal:133,fat:3.2,sug:0,cat:"🥩 肉类"},{id:12,n:"猪里脊",kcal:155,fat:7.9,sug:0,cat:"🥩 肉类"},
  {id:13,n:"五花肉",kcal:395,fat:35,sug:0,cat:"🥩 肉类",warn:"fat"},{id:14,n:"牛腱子",kcal:125,fat:4,sug:0,cat:"🥩 肉类"},
  {id:15,n:"三文鱼",kcal:208,fat:13,sug:0,cat:"🥩 肉类"},{id:16,n:"虾仁",kcal:93,fat:0.9,sug:0,cat:"🥩 肉类"},
  {id:17,n:"鸡蛋",kcal:144,fat:10,sug:1.1,cat:"🥚 蛋奶"},{id:18,n:"全脂牛奶",kcal:66,fat:3.7,sug:4.7,cat:"🥚 蛋奶"},
  {id:19,n:"希腊酸奶",kcal:97,fat:5,sug:3.6,cat:"🥚 蛋奶"},{id:20,n:"北豆腐",kcal:76,fat:4.7,sug:1.5,cat:"🌿 豆蔬"},
  {id:21,n:"豆浆(无糖)",kcal:33,fat:1.8,sug:1.1,cat:"🌿 豆蔬"},{id:22,n:"西兰花",kcal:33,fat:0.4,sug:3.5,cat:"🥦 蔬菜"},
  {id:23,n:"番茄",kcal:18,fat:0.2,sug:3,cat:"🥦 蔬菜"},{id:24,n:"黄瓜",kcal:15,fat:0.1,sug:2.2,cat:"🥦 蔬菜"},
  {id:25,n:"胡萝卜",kcal:37,fat:0.2,sug:7,cat:"🥦 蔬菜"},{id:26,n:"菠菜",kcal:23,fat:0.4,sug:1.8,cat:"🥦 蔬菜"},
  {id:27,n:"苹果",kcal:52,fat:0.2,sug:11,cat:"🍎 水果"},{id:28,n:"香蕉",kcal:89,fat:0.3,sug:20,cat:"🍎 水果"},
  {id:29,n:"橙子",kcal:47,fat:0.1,sug:9.4,cat:"🍎 水果"},{id:30,n:"草莓",kcal:32,fat:0.3,sug:5.8,cat:"🍎 水果"},
  {id:31,n:"核桃",kcal:654,fat:65,sug:7,cat:"🥜 坚果",warn:"fat"},{id:32,n:"杏仁(生)",kcal:579,fat:50,sug:4.8,cat:"🥜 坚果",warn:"fat"},
  {id:33,n:"花生(炒)",kcal:581,fat:48,sug:8,cat:"🥜 坚果",warn:"fat"},{id:34,n:"可乐(原味)",kcal:42,fat:0,sug:10.6,cat:"🥤 饮料",warn:"sug"},
  {id:35,n:"奶茶(全糖)",kcal:60,fat:2,sug:9,cat:"🥤 饮料"},{id:36,n:"炸鸡腿",kcal:290,fat:17,sug:8,cat:"⚠️ 高危",warn:"combo"},
  {id:37,n:"奶油蛋糕",kcal:347,fat:15,sug:45,cat:"⚠️ 高危",warn:"combo"},{id:38,n:"薯条(炸)",kcal:312,fat:17,sug:34,cat:"⚠️ 高危",warn:"combo"},
  {id:39,n:"芝士披萨",kcal:266,fat:10,sug:29,cat:"⚠️ 高危",warn:"combo"},{id:40,n:"牛奶巧克力",kcal:546,fat:31,sug:55,cat:"⚠️ 高危",warn:"combo"},
  {id:41,n:"薯片",kcal:536,fat:34,sug:50,cat:"⚠️ 高危",warn:"combo"},{id:42,n:"冰淇淋",kcal:207,fat:11,sug:24,cat:"⚠️ 高危",warn:"combo"},
  {id:43,n:"汉堡(牛肉芝士)",kcal:295,fat:14,sug:24,cat:"⚠️ 高危",warn:"combo"},{id:44,n:"曲奇饼干",kcal:502,fat:25,sug:57,cat:"⚠️ 高危",warn:"combo"},
];

/* ── MINI COMPONENTS ── */
const Tag = ({type}) => {
  const m = {combo:{l:"糖油",bg:"#FDECEA",c:C.red},fat:{l:"高脂",bg:"#FEF3E6",c:C.amber},
              sug:{l:"高糖",bg:"#FEF3E6",c:C.amber},user:{l:"自定义",bg:C.priL,c:C.pri}};
  const t=m[type]; if(!t) return null;
  return <span style={{fontSize:10,background:t.bg,color:t.c,borderRadius:6,padding:"2px 7px",fontWeight:700}}>{t.l}</span>;
};

function CalRing({consumed,goal}){
  const sz=156,sw=12,r=(sz-sw)/2,circ=2*Math.PI*r;
  const pct=Math.min(consumed/goal,1),over=consumed>goal;
  return(
    <div style={{position:"relative",width:sz,height:sz,flexShrink:0}}>
      <svg width={sz} height={sz} style={{position:"absolute"}}>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={C.border} strokeWidth={sw}/>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none"
          stroke={over?C.red:C.green} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
          strokeLinecap="round" transform={`rotate(-90 ${sz/2} ${sz/2})`}
          style={{transition:"stroke-dashoffset .7s ease"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:26,fontWeight:800,color:C.navy,lineHeight:1}}>{Math.round(consumed)}</span>
        <span style={{fontSize:11,color:C.mid,marginTop:3}}>kcal 今日</span>
        <span style={{fontSize:12,fontWeight:700,marginTop:4,color:over?C.red:C.green}}>
          {over?`↑超 ${Math.round(consumed-goal)}`:`余 ${Math.round(goal-consumed)}`}
        </span>
      </div>
    </div>
  );
}

function NutBar({label,val,max,unit,warnName}){
  const pct=Math.min(val/max*100,100),warn=pct>=75&&pct<100,danger=pct>=100;
  const color=danger?C.red:warn?C.amber:C.pri;
  return(
    <div style={{marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"baseline"}}>
        <span style={{fontSize:13,color:C.mid}}>{label}</span>
        <span style={{fontSize:13,fontWeight:700,color:danger?C.red:C.navy}}>
          {val%1?val.toFixed(1):Math.round(val)}{unit}
          <span style={{color:C.lite,fontWeight:400}}> / {max}{unit}</span>
        </span>
      </div>
      <div style={{height:8,background:C.border,borderRadius:4,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,borderRadius:4,background:color,transition:"width .5s ease"}}/>
      </div>
      {danger&&<p style={{margin:"4px 0 0",fontSize:11,color:C.red}}>⚠️ 已超出{warnName}上限</p>}
      {warn&&<p style={{margin:"4px 0 0",fontSize:11,color:C.amber}}>⚡ 接近{warnName}上限，注意控制</p>}
    </div>
  );
}

function DayCard({summary,weightEntry,goalKcal,waterGoal,onExport}){
  const [meals,setMeals]=useState(null);
  const [open,setOpen]=useState(false);
  const toggle=async()=>{
    if(!open&&meals===null){const l=await S.get(`cal_logs_${summary.date}`);setMeals(l||[]);}
    setOpen(v=>!v);
  };
  const pct=Math.min(summary.kcal/goalKcal*100,100),over=summary.kcal>goalKcal;
  const d=new Date(summary.date+"T00:00:00");
  const label=d.toLocaleDateString("zh-CN",{month:"long",day:"numeric",weekday:"short"});
  return(
    <div style={{background:C.white,borderRadius:22,margin:"10px 16px",boxShadow:C.shadowSm,overflow:"hidden"}}>
      <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,flexShrink:0,position:"relative",cursor:"pointer"}} onClick={toggle}>
          <svg width={44} height={44}>
            <circle cx={22} cy={22} r={17} fill="none" stroke={C.border} strokeWidth={5}/>
            <circle cx={22} cy={22} r={17} fill="none"
              stroke={over?C.red:C.green} strokeWidth={5}
              strokeDasharray={2*Math.PI*17}
              strokeDashoffset={2*Math.PI*17*(1-pct/100)}
              strokeLinecap="round" transform="rotate(-90 22 22)"/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:9,fontWeight:800,color:over?C.red:C.navy}}>
            {Math.round(pct)}%
          </div>
        </div>
        <div style={{flex:1,cursor:"pointer"}} onClick={toggle}>
          <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
            <span style={{fontSize:13,fontWeight:700,color:C.navy}}>{label}</span>
            {weightEntry&&<span style={{fontSize:11,background:C.greenL,color:C.green,borderRadius:8,padding:"2px 8px",fontWeight:600}}>⚖️ {weightEntry.weight}kg</span>}
          </div>
          <div style={{fontSize:12,color:C.mid,marginTop:3}}>
            {Math.round(summary.kcal)} kcal · 脂{summary.fat.toFixed(1)}g · 糖{summary.sug.toFixed(1)}g · 💧{summary.water}/{waterGoal}杯
          </div>
        </div>
        {/* Export button */}
        <button onClick={e=>{e.stopPropagation();onExport&&onExport();}}
          style={{flexShrink:0,width:32,height:32,borderRadius:9,border:`1.5px solid ${C.border}`,
            background:C.white,color:C.pri,fontSize:14,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>
          ↓
        </button>
        <span style={{color:C.lite,fontSize:13,cursor:"pointer",flexShrink:0}} onClick={toggle}>{open?"▲":"▼"}</span>
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${C.border}`,padding:"4px 16px 12px"}}>
          {meals===null&&<p style={{color:C.lite,fontSize:12,textAlign:"center",padding:"10px 0"}}>加载中…</p>}
          {meals&&meals.map(l=>(
            <div key={l.id} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`,
              fontSize:12,display:"flex",justifyContent:"space-between"}}>
              <span style={{color:C.navy}}>{l.name}{l.weight?` · ${l.weight}g`:""}</span>
              <span style={{color:C.mid,flexShrink:0,marginLeft:8}}>{Math.round(l.kcal)} kcal · {l.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── SETTINGS TAB with editable food library ── */
function SettingsTab({settings,onSave,userFoods,onDeleteFood,onUpdateFood,onClearFoods}){
  const [loc,setLoc]=useState(settings);
  const [showLib,setShowLib]=useState(false);
  const [editId,setEditId]=useState(null);
  const [ef,setEf]=useState({n:"",kcal:"",fat:"",sug:""});

  const startEdit=f=>{ setEditId(f.id); setEf({n:f.n,kcal:String(f.kcal),fat:String(f.fat||0),sug:String(f.sug||0)}); };
  const saveEdit=()=>{ onUpdateFood({id:editId,n:ef.n,kcal:+ef.kcal,fat:+ef.fat,sug:+ef.sug}); setEditId(null); };

  const fields=[
    {key:"goalKcal",label:"每日热量目标",unit:"kcal",min:800,max:3000,step:50,hint:"轻度减脂建议 1200–1500 kcal"},
    {key:"fatLimit",label:"每日脂肪上限",unit:"g",min:20,max:120,step:5,hint:"WHO 建议 <50g"},
    {key:"sugarLimit",label:"每日糖分上限",unit:"g",min:10,max:100,step:5,hint:"WHO 建议游离糖 <25–50g"},
    {key:"waterGoal",label:"每日饮水目标",unit:"杯",min:4,max:16,step:1,hint:"每杯约 250ml"},
    {key:"weightGoal",label:"目标体重",unit:"kg",min:35,max:150,step:0.5,hint:"设定你的减脂目标体重"},
  ];

  return(
    <div>
      <div style={{padding:"24px 20px 6px"}}>
        <h1 style={{margin:0,fontSize:26,fontWeight:800,color:C.navy}}>个人设置</h1>
        <p style={{margin:"4px 0 0",fontSize:13,color:C.mid}}>自定义你的减脂目标</p>
      </div>

      <div style={card}>
        {fields.map(f=>(
          <div key={f.key} style={{marginBottom:22}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <label style={{fontSize:14,color:C.navy,fontWeight:600}}>{f.label}</label>
              <span style={{fontSize:15,fontWeight:800,color:C.pri}}>{loc[f.key]||0}{f.unit}</span>
            </div>
            <input type="range" min={f.min} max={f.max} step={f.step} value={loc[f.key]||0}
              onChange={e=>setLoc(p=>({...p,[f.key]:+e.target.value}))}
              style={{width:"100%",accentColor:C.pri}}/>
            <p style={{margin:"4px 0 0",fontSize:11,color:C.lite}}>{f.hint}</p>
          </div>
        ))}
        <button onClick={()=>onSave(loc)}
          style={{width:"100%",padding:13,background:C.pri,color:"#fff",border:"none",
            borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          保存设置
        </button>
      </div>

      {/* API Key */}
      <div style={card}>
        <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>🔑 Anthropic API Key</div>
        <div style={{fontSize:12,color:C.mid,marginBottom:10}}>用于 AI 估算脂肪/糖分功能。<a href="https://console.anthropic.com" target="_blank" style={{color:C.pri}}>点此获取</a>，仅存储在本地。</div>
        <input type="password" value={loc.apiKey||""} placeholder="sk-ant-..."
          onChange={e=>setLoc(p=>({...p,apiKey:e.target.value}))}
          style={{...inp,marginBottom:10}}/>
        <button onClick={()=>onSave(loc)}
          style={{width:"100%",padding:11,background:C.pri,color:"#fff",border:"none",
            borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
          保存 API Key
        </button>
      </div>

      {/* Food Library */}
      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}
          onClick={()=>setShowLib(v=>!v)}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:C.navy}}>📝 我的食物库</div>
            <div style={{fontSize:12,color:C.mid,marginTop:2}}>
              {userFoods.length>0?`已保存 ${userFoods.length} 个自定义食物`:"暂无自定义食物"}
            </div>
          </div>
          <div style={{width:32,height:32,borderRadius:10,background:C.priL,display:"flex",
            alignItems:"center",justifyContent:"center",fontSize:16,color:C.pri}}>
            {showLib?"▲":"▼"}
          </div>
        </div>

        {showLib&&(
          <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
            {userFoods.length===0&&(
              <p style={{fontSize:13,color:C.lite,textAlign:"center",padding:"12px 0"}}>
                添加新食物时自动保存在这里
              </p>
            )}
            {userFoods.map(f=>editId===f.id?(
              <div key={f.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:6,marginBottom:8}}>
                  {[{l:"名称",k:"n",t:"text"},{l:"kcal",k:"kcal",t:"number"},{l:"脂肪g",k:"fat",t:"number"},{l:"糖分g",k:"sug",t:"number"}].map(field=>(
                    <div key={field.k}>
                      <div style={{fontSize:10,color:C.mid,marginBottom:3}}>{field.l}</div>
                      <input type={field.t} value={ef[field.k]}
                        onChange={e=>setEf(p=>({...p,[field.k]:e.target.value}))}
                        style={{...inp,padding:"7px 9px",fontSize:12}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={saveEdit}
                    style={{flex:1,padding:"9px",borderRadius:10,background:C.pri,color:"#fff",
                      border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    ✓ 保存修改
                  </button>
                  <button onClick={()=>setEditId(null)}
                    style={{flex:1,padding:"9px",borderRadius:10,background:C.border,color:C.mid,
                      border:"none",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                    取消
                  </button>
                </div>
              </div>
            ):(
              <div key={f.id} style={{display:"flex",alignItems:"center",gap:8,
                padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,color:C.navy,fontWeight:600}}>{f.n}</div>
                  <div style={{fontSize:11,color:C.mid,marginTop:2}}>
                    {f.totalOnly?`${Math.round(f.kcal)} kcal/份`:`${f.kcal} kcal/100g · 脂${f.fat}g · 糖${f.sug}g`}
                  </div>
                </div>
                <button onClick={()=>startEdit(f)}
                  style={{padding:"5px 12px",borderRadius:8,border:`1.5px solid ${C.pri}`,
                    background:"none",color:C.pri,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  编辑
                </button>
                <button onClick={()=>onDeleteFood(f.id)}
                  style={{border:"none",background:"none",color:C.lite,fontSize:20,cursor:"pointer",lineHeight:1,padding:"0 2px"}}>×</button>
              </div>
            ))}
            {userFoods.length>0&&(
              <button onClick={onClearFoods}
                style={{marginTop:12,width:"100%",background:"none",border:`1.5px solid ${C.border}`,
                  color:C.mid,borderRadius:12,padding:"9px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
                🗑️ 清空全部食物库
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{...card,textAlign:"center"}}>
        <p style={{margin:"0 0 12px",fontSize:12,color:C.mid}}>危险操作</p>
        <button onClick={()=>onSave({...loc,_clearToday:true})}
          style={{background:"none",border:`1.5px solid ${C.border}`,color:C.mid,
            borderRadius:12,padding:"9px 24px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
          🗑️ 清除今日记录
        </button>
      </div>
    </div>
  );
}

/* ══════════════════ MAIN APP ════════════════════ */
export default function App(){
  const dk=todayKey();
  const [tab,setTab]=useState("today");
  const [settings,setSettings]=useState({goalKcal:1500,fatLimit:50,sugarLimit:50,waterGoal:8,weightGoal:55,apiKey:''});
  const [logs,setLogs]=useState([]);
  const [water,setWater]=useState(0);
  const [userFoods,setUserFoods]=useState([]);
  const [dateIndex,setDateIndex]=useState([]);
  const [weightLogs,setWeightLogs]=useState([]);
  const [weightInput,setWeightInput]=useState("");
  const [ready,setReady]=useState(false);
  const [toast,setToast]=useState(null);
  const [exportModal,setExportModal]=useState(null); // {title, csv}
  // Record form
  const [query,setQuery]=useState("");
  const [selected,setSelected]=useState(null);
  const [showSug,setShowSug]=useState(false);
  const [weight,setWeight]=useState("");
  const [customKJ,setCustomKJ]=useState("");
  const [customF,setCustomF]=useState("");
  const [customS,setCustomS]=useState("");
  const [inputMode,setInputMode]=useState("per100g");
  const [totalCal,setTotalCal]=useState("");
  const [totalUnit,setTotalUnit]=useState("kcal");
  const [estFat,setEstFat]=useState("");
  const [estSug,setEstSug]=useState("");
  const [isEst,setIsEst]=useState(false);
  const [portions,setPortions]=useState(1); // for totalOnly foods

  useEffect(()=>{
    (async()=>{
      const s=await S.get("cal_settings"); if(s) setSettings(s);
      const l=await S.get(`cal_logs_${dk}`); if(l) setLogs(l);
      const w=await S.get(`cal_water_${dk}`); if(typeof w==="number") setWater(w);
      const uf=await S.get("cal_user_foods"); if(uf) setUserFoods(uf);
      const di=await S.get("cal_date_index"); if(di) setDateIndex(di);
      const wl=await S.get("cal_weight_logs"); if(wl) setWeightLogs(wl);
      setReady(true);
    })();
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  },[]);

  useEffect(()=>{ if(ready) S.set("cal_settings",settings); },[settings,ready]);
  useEffect(()=>{ if(ready) S.set(`cal_logs_${dk}`,logs); },[logs,ready]);
  useEffect(()=>{ if(ready) S.set(`cal_water_${dk}`,water); },[water,ready]);
  useEffect(()=>{ if(ready) S.set("cal_user_foods",userFoods); },[userFoods,ready]);
  useEffect(()=>{ if(ready) S.set("cal_date_index",dateIndex); },[dateIndex,ready]);
  useEffect(()=>{ if(ready) S.set("cal_weight_logs",weightLogs); },[weightLogs,ready]);

  useEffect(()=>{
    if(!ready) return;
    const kcal=logs.reduce((a,l)=>a+l.kcal,0);
    const fat=logs.reduce((a,l)=>a+l.fat,0);
    const sug=logs.reduce((a,l)=>a+l.sug,0);
    if(kcal===0&&water===0) return;
    const summary={date:dk,kcal,fat,sug,water};
    setDateIndex(prev=>[summary,...prev.filter(d=>d.date!==dk)].sort((a,b)=>b.date.localeCompare(a.date)));
  },[logs,water,ready]);

  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(null),2200);};

  const logWeight=()=>{
    const w=parseFloat(weightInput); if(isNaN(w)||w<=0) return;
    setWeightLogs(prev=>[{id:Date.now(),date:dk,weight:w},...prev.filter(x=>x.date!==dk)].sort((a,b)=>b.date.localeCompare(a.date)));
    setWeightInput(""); showToast(`✓ 体重已记录：${w} kg`);
  };
  const latestWeight=weightLogs[0]||null;
  const todayWeight=weightLogs.find(w=>w.date===dk);

  const T=logs.reduce((a,l)=>({kcal:a.kcal+l.kcal,fat:a.fat+l.fat,sug:a.sug+l.sug,combo:a.combo+(l.isCombo?l.kcal:0)}),{kcal:0,fat:0,sug:0,combo:0});

  const allFoods=[...DB,...userFoods];
  const sugg=query.length>=1?allFoods.filter(f=>f.n.includes(query)).slice(0,7):[];

  const estimateNutrition=async(name,kcal)=>{
    if(!name||!kcal) return;
    if(!settings.apiKey){showToast("请先在设置页填写 Anthropic API Key");return;}
    setIsEst(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":settings.apiKey,"anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:100,
          messages:[{role:"user",content:`Food: "${name}", total ${kcal} kcal. Estimate fat(g) and sugar(g) for this serving. Reply ONLY with JSON: {"fat":number,"sugar":number}`}]})
      });
      const data=await res.json();
      const txt=data.content?.find(b=>b.type==="text")?.text||"{}";
      const p=JSON.parse(txt.replace(/```json|```/g,"").trim());
      if(p.fat!==undefined) setEstFat(String(Math.round(p.fat*10)/10));
      if(p.sugar!==undefined) setEstSug(String(Math.round(p.sugar*10)/10));
    }catch{}
    setIsEst(false);
  };

  const totalKcalValue=totalCal?(totalUnit==="kj"?+totalCal/KJ:+totalCal):0;

  const preview=selected&&!selected.totalOnly&&weight&&+weight>0
    ?{kcal:(selected.kcal*+weight)/100,fat:(selected.fat*+weight)/100,sug:(selected.sug*+weight)/100}
    :selected&&selected.totalOnly
    ?{kcal:selected.kcal*portions,fat:(selected.fat||0)*portions,sug:(selected.sug||0)*portions}
    :!selected&&inputMode==="per100g"&&customKJ&&weight&&+weight>0
    ?{kcal:((+customKJ/KJ)*+weight)/100,fat:(+(customF||0)*+weight)/100,sug:(+(customS||0)*+weight)/100}
    :!selected&&inputMode==="total"&&totalKcalValue>0
    ?{kcal:totalKcalValue,fat:+(estFat||0),sug:+(estSug||0)}
    :null;

  const canAdd=selected
    ?(selected.totalOnly ? true : (!!weight&&+weight>0))
    :inputMode==="per100g"?(sugg.length===0&&!!query&&!!customKJ&&+customKJ>0&&!!weight&&+weight>0)
    :(sugg.length===0&&!!query&&totalKcalValue>0);

  const resetForm=()=>{setQuery("");setSelected(null);setWeight("");setShowSug(false);setPortions(1);
    setCustomKJ("");setCustomF("");setCustomS("");setTotalCal("");setEstFat("");setEstSug("");setInputMode("per100g");};

  const handleAdd=()=>{
    if(!canAdd) return;
    let entry;
    if(selected){
      if(selected.totalOnly){
        entry={id:Date.now(),name:selected.n+(portions>1?` ×${portions}`:""),weight:null,
          kcal:selected.kcal*portions,fat:(selected.fat||0)*portions,sug:(selected.sug||0)*portions,
          isCombo:isCombo(selected),warn:selected.warn||null,
          time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})};
      } else {
        const w=+weight;
        entry={id:Date.now(),name:selected.n,weight:w,kcal:(selected.kcal*w)/100,fat:(selected.fat*w)/100,
          sug:(selected.sug*w)/100,isCombo:isCombo(selected),warn:selected.warn||null,
          time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})};
      }
    } else if(inputMode==="per100g"){
      const w=+weight,kp=+customKJ/KJ,f=+(customF||0),s=+(customS||0);
      entry={id:Date.now(),name:query,weight:w,kcal:(kp*w)/100,fat:(f*w)/100,sug:(s*w)/100,
        isCombo:f>=10&&s>=15,warn:null,
        time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})};
      setUserFoods(prev=>prev.some(x=>x.n===query)?prev:[...prev,{id:Date.now()+1,n:query,
        kcal:Math.round(kp*10)/10,fat:f,sug:s,cat:"📝 我的食物",isCustom:true}]);
    } else {
      const f=+(estFat||0),s=+(estSug||0);
      entry={id:Date.now(),name:query,weight:null,kcal:totalKcalValue,fat:f,sug:s,
        isCombo:f>=10&&s>=15,warn:null,
        time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})};
      setUserFoods(prev=>prev.some(x=>x.n===query)?prev:[...prev,{id:Date.now()+1,n:query,
        kcal:Math.round(totalKcalValue*10)/10,fat:f,sug:s,cat:"📝 我的食物",isCustom:true,totalOnly:true}]);
    }
    setLogs(p=>[...p,entry]);
    showToast(`✓ 已记录「${entry.name}」${Math.round(entry.kcal)} kcal`);
    resetForm(); setTab("today");
  };

  const buildCSV = (rows) => {
    const esc = v => `"${String(v).replace(/"/g,'""')}"`;
    return rows.map(r => r.map(esc).join(",")).join("\n");
  };

  const showExport = (title, csv) => setExportModal({ title, csv });

  const exportDay = async (dateStr) => {
    const meals = await S.get(`cal_logs_${dateStr}`) || [];
    const wEntry = weightLogs.find(w => w.date === dateStr);
    const summary = dateIndex.find(d => d.date === dateStr);
    const d = new Date(dateStr + "T00:00:00");
    const label = d.toLocaleDateString("zh-CN", {year:"numeric",month:"2-digit",day:"2-digit"});

    const header = [["减脂记录导出"], [`日期：${label}`], []];
    const colHead = [["时间","食物名称","重量(g)","热量(kcal)","脂肪(g)","糖分(g)","备注"]];
    const mealRows = meals.map(l => [
      l.time, l.name, l.weight ?? "—", Math.round(l.kcal),
      l.fat.toFixed(1), l.sug.toFixed(1),
      l.isCombo ? "糖油" : l.warn === "fat" ? "高脂" : l.warn === "sug" ? "高糖" : "",
    ]);
    const blank = [["","","","","","",""]];
    const total = [["【当日合计】","","",
      summary ? Math.round(summary.kcal) : meals.reduce((a,l)=>a+l.kcal,0).toFixed(0),
      summary ? summary.fat.toFixed(1) : "—",
      summary ? summary.sug.toFixed(1) : "—",
      wEntry ? `体重：${wEntry.weight} kg` : "",
    ]];
    const csv = buildCSV([...header, ...colHead, ...mealRows, ...blank, ...total]);
    showExport(`${label} 饮食记录`, csv);
  };

  const exportAll = async () => {
    if (dateIndex.length === 0) { showToast("暂无历史记录可导出"); return; }
    const header = [["减脂记录 · 全部历史"], [`导出时间：${new Date().toLocaleString("zh-CN")}`], []];
    const colHead = [["日期","时间","食物名称","重量(g)","热量(kcal)","脂肪(g)","糖分(g)","当日合计kcal","当日体重kg","备注"]];
    const allRows = [];
    for (const s of dateIndex) {
      const meals = await S.get(`cal_logs_${s.date}`) || [];
      const wEntry = weightLogs.find(w => w.date === s.date);
      const d = new Date(s.date + "T00:00:00");
      const dateLabel = d.toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit"});
      meals.forEach((l, i) => {
        allRows.push([
          i===0?dateLabel:"", l.time, l.name, l.weight??"—", Math.round(l.kcal),
          l.fat.toFixed(1), l.sug.toFixed(1),
          i===0?Math.round(s.kcal):"", i===0&&wEntry?wEntry.weight:"",
          l.isCombo?"糖油":l.warn==="fat"?"高脂":l.warn==="sug"?"高糖":"",
        ]);
      });
      if (meals.length===0) allRows.push([dateLabel,"—","—","—","—","—","—",Math.round(s.kcal),wEntry?.weight||"",""]);
      allRows.push(Array(10).fill(""));
    }
    const csv = buildCSV([...header, ...colHead, ...allRows]);
    showExport(`全部历史记录（${dateIndex.length} 天）`, csv);
  };

  const handleSaveSettings=s=>{
    if(s._clearToday){const{_clearToday,...clean}=s;setSettings(clean);setLogs([]);setWater(0);showToast("✓ 今日记录已清除");}
    else{setSettings(s);showToast("✓ 设置已保存");}
  };

  if(!ready) return(
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",
      justifyContent:"center",color:C.pri,fontSize:16,fontFamily:"sans-serif"}}>加载中…</div>
  );

  const NAV=[
    {id:"today",icon:"🏠",label:"今日"},
    {id:"record",icon:"✚",label:"记录"},
    {id:"history",icon:"📅",label:"历史"},
    {id:"settings",icon:"⚙",label:"设置"},
  ];

  const activeBtnStyle={
    padding:"13px",borderRadius:14,fontSize:15,fontWeight:700,border:"none",
    cursor:"pointer",fontFamily:"inherit",width:"100%",background:C.pri,color:"#fff",transition:"background .2s"
  };
  const disabledBtnStyle={...activeBtnStyle,background:C.border,color:C.lite,cursor:"default"};

  return(
    <div style={{fontFamily:"'Noto Sans SC',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",paddingBottom:90}}>

      {/* Export Modal */}
      {exportModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,22,54,.55)",zIndex:200,
          display:"flex",alignItems:"flex-end",justifyContent:"center"}}
          onClick={()=>setExportModal(null)}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:C.white,borderRadius:"24px 24px 0 0",padding:"20px 16px 36px",
              width:"100%",maxWidth:430,maxHeight:"80vh",display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:C.navy}}>📋 {exportModal.title}</div>
                <div style={{fontSize:12,color:C.mid,marginTop:2}}>全选复制后粘贴到 Excel / Numbers / 备忘录</div>
              </div>
              <button onClick={()=>setExportModal(null)}
                style={{border:"none",background:C.border,color:C.mid,width:32,height:32,
                  borderRadius:10,fontSize:18,cursor:"pointer",fontFamily:"inherit",lineHeight:1}}>×</button>
            </div>
            <textarea readOnly value={exportModal.csv}
              ref={el => {
                if (el) {
                  el.select();
                  try { document.execCommand('copy'); showToast("✓ 已自动复制到剪贴板"); } catch {}
                }
              }}
              style={{flex:1,minHeight:200,maxHeight:"45vh",resize:"none",borderRadius:12,
                border:`1.5px solid ${C.border}`,padding:"10px 12px",fontSize:11,
                color:C.navy,background:"#FAFAFF",fontFamily:"monospace",lineHeight:1.6,outline:"none"}}/>
            <button onClick={e => {
                const ta = e.target.closest('div').querySelector('textarea');
                ta.select();
                try {
                  document.execCommand('copy');
                  showToast("✓ 已复制到剪贴板");
                } catch {
                  navigator.clipboard?.writeText(exportModal.csv).then(()=>showToast("✓ 已复制")).catch(()=>showToast("请长按文本框手动复制"));
                }
              }}
              style={{padding:"13px",background:C.pri,color:"#fff",border:"none",
                borderRadius:14,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              📋 一键复制全部内容
            </button>
          </div>
        </div>
      )}
      {toast&&(
        <div style={{position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",
          background:C.navy,color:"#fff",padding:"10px 22px",borderRadius:24,fontSize:13,
          zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,.18)",pointerEvents:"none"}}>
          {toast}
        </div>
      )}

      {/* ═══ TODAY ═══ */}
      {tab==="today"&&(
        <div>
          <div style={{padding:"24px 20px 6px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <p style={{margin:0,fontSize:12,color:C.mid}}>
                {new Date().toLocaleDateString("zh-CN",{month:"long",day:"numeric",weekday:"short"})}
              </p>
              <h1 style={{margin:"2px 0 0",fontSize:26,fontWeight:800,color:C.navy}}>今日饮食</h1>
            </div>
            {latestWeight&&(
              <div style={{background:C.white,borderRadius:14,padding:"6px 12px",boxShadow:C.shadowSm,textAlign:"right"}}>
                <div style={{fontSize:10,color:C.mid}}>当前体重</div>
                <div style={{fontSize:16,fontWeight:800,color:C.navy}}>{latestWeight.weight}<span style={{fontSize:11,fontWeight:400}}> kg</span></div>
              </div>
            )}
          </div>

          {/* Calorie card */}
          <div style={card}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <CalRing consumed={T.kcal} goal={settings.goalKcal}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{margin:"0 0 10px",fontSize:12,color:C.mid}}>目标 <b style={{color:C.navy}}>{settings.goalKcal}</b> kcal</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                  {[{l:"脂肪",v:`${T.fat.toFixed(1)}g`},{l:"糖分",v:`${T.sug.toFixed(1)}g`},
                    {l:"糖油混合",v:`${Math.round(T.combo)}kcal`},{l:"已记录",v:`${logs.length}项`}].map(x=>(
                    <div key={x.l} style={{background:C.bg,borderRadius:10,padding:"7px 10px"}}>
                      <div style={{fontSize:11,color:C.mid}}>{x.l}</div>
                      <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{x.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bars */}
          <div style={card}>
            <h3 style={{margin:"0 0 16px",fontSize:14,color:C.navy,fontWeight:700}}>营养摄入追踪</h3>
            <NutBar label="🧈 脂肪"       val={T.fat}   max={settings.fatLimit}   unit="g"    warnName="脂肪"/>
            <NutBar label="🍬 糖分"       val={T.sug}   max={settings.sugarLimit} unit="g"    warnName="糖分"/>
            <NutBar label="⚠️ 糖油混合物" val={T.combo} max={500}                 unit="kcal" warnName="糖油混合物"/>
          </div>

          {/* Water */}
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:14,fontWeight:700,color:C.navy}}>💧 今日饮水</span>
              <span style={{fontSize:13,color:C.mid}}>{water} / {settings.waterGoal} 杯</span>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {Array.from({length:settings.waterGoal}).map((_,i)=>(
                <div key={i} onClick={()=>{if(i>=water)setWater(w=>w+1);}}
                  style={{width:32,height:32,borderRadius:10,cursor:"pointer",
                    background:i<water?C.pri:C.border,display:"flex",alignItems:"center",
                    justifyContent:"center",fontSize:14,transition:"background .25s",userSelect:"none",color:"#fff"}}>
                  {i<water?"💧":""}
                </div>
              ))}
            </div>
            {water<Math.ceil(settings.waterGoal*.5)&&(
              <div style={{background:C.amberL,borderRadius:10,padding:"8px 12px",fontSize:12,color:C.amber}}>
                ⏰ 喝水进度偏慢，记得多补水！
              </div>
            )}
            {water>=settings.waterGoal&&(
              <div style={{background:C.greenL,borderRadius:10,padding:"8px 12px",fontSize:12,color:C.green}}>
                🎉 今日饮水目标达成！
              </div>
            )}
          </div>

          {/* Weight */}
          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
              <span style={{fontSize:14,fontWeight:700,color:C.navy}}>⚖️ 体重记录</span>
              {settings.weightGoal&&<span style={{fontSize:12,color:C.mid}}>目标 {settings.weightGoal} kg</span>}
            </div>
            {latestWeight&&settings.weightGoal&&(
              <div style={{marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:C.mid}}>
                  当前 <b style={{color:C.navy,fontSize:15}}>{latestWeight.weight}</b> kg
                  {latestWeight.date!==dk&&<span style={{color:C.lite,fontSize:11}}> ({new Date(latestWeight.date+"T00:00:00").toLocaleDateString("zh-CN",{month:"short",day:"numeric"})})</span>}
                </span>
                <span style={{fontSize:13,fontWeight:700,color:latestWeight.weight<=settings.weightGoal?C.green:C.pri}}>
                  {latestWeight.weight<=settings.weightGoal?"🎉 已达目标！":`差 ${(latestWeight.weight-settings.weightGoal).toFixed(1)} kg`}
                </span>
              </div>
            )}
            {todayWeight?(
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                background:C.greenL,borderRadius:12,padding:"10px 14px"}}>
                <span style={{fontSize:14,color:C.green,fontWeight:700}}>今日：{todayWeight.weight} kg</span>
                <button onClick={()=>setWeightLogs(p=>p.filter(x=>x.date!==dk))}
                  style={{border:"none",background:"none",color:C.lite,fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>
              </div>
            ):(
              <div style={{display:"flex",gap:8}}>
                <input type="number" step="0.1" value={weightInput}
                  onChange={e=>setWeightInput(e.target.value)}
                  placeholder="输入今日体重，如 58.5"
                  onKeyDown={e=>e.key==="Enter"&&logWeight()}
                  style={{...inp,flex:1}}/>
                <button onClick={logWeight} disabled={!weightInput}
                  style={weightInput?{...activeBtnStyle,width:"auto",padding:"10px 16px",fontSize:13,borderRadius:12}
                    :{...disabledBtnStyle,width:"auto",padding:"10px 16px",fontSize:13,borderRadius:12}}>
                  记录
                </button>
              </div>
            )}
          </div>

          {/* Meal list */}
          {logs.length>0&&(
            <div style={card}>
              <h3 style={{margin:"0 0 12px",fontSize:14,color:C.navy,fontWeight:700}}>今日饮食明细</h3>
              {[...logs].reverse().map(l=>(
                <div key={l.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                      <span style={{fontSize:14,color:C.navy,fontWeight:600}}>{l.name}</span>
                      {l.isCombo&&<Tag type="combo"/>}{l.warn==="fat"&&<Tag type="fat"/>}{l.warn==="sug"&&<Tag type="sug"/>}
                    </div>
                    <div style={{fontSize:12,color:C.mid,marginTop:3}}>
                      {l.weight?`${l.weight}g · `:""}{Math.round(l.kcal)} kcal · 脂{l.fat.toFixed(1)}g · 糖{l.sug.toFixed(1)}g
                      <span style={{marginLeft:8,color:C.lite}}>{l.time}</span>
                    </div>
                  </div>
                  <button onClick={()=>setLogs(p=>p.filter(x=>x.id!==l.id))}
                    style={{border:"none",background:"none",color:C.lite,fontSize:22,cursor:"pointer",lineHeight:1,padding:"0 2px",flexShrink:0}}>×</button>
                </div>
              ))}
            </div>
          )}
          {logs.length===0&&(
            <div style={{textAlign:"center",padding:"50px 20px",color:C.lite}}>
              <div style={{fontSize:40,marginBottom:12}}>🍽️</div>
              <div style={{fontSize:14}}>今天还没有饮食记录</div>
              <div style={{fontSize:12,marginTop:6}}>点下方「✚ 记录」开始添加</div>
            </div>
          )}
        </div>
      )}

      {/* ═══ RECORD ═══ */}
      {tab==="record"&&(
        <div>
          <div style={{padding:"24px 20px 6px"}}>
            <h1 style={{margin:0,fontSize:26,fontWeight:800,color:C.navy}}>添加记录</h1>
            <p style={{margin:"4px 0 0",fontSize:13,color:C.mid}}>搜索食物，输入用量，自动计算热量</p>
          </div>

          <div style={card}>
            {/* Search */}
            <div style={{marginBottom:14,position:"relative"}}>
              <label style={{fontSize:13,color:C.mid,display:"block",marginBottom:6}}>食物名称</label>
              <input style={inp} value={query} placeholder="搜索，如：鸡胸肉、白米饭…"
                onChange={e=>{setQuery(e.target.value);setSelected(null);setShowSug(true);}}
                onFocus={()=>setShowSug(true)}/>
              {showSug&&sugg.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:60,
                  background:C.white,border:`1px solid ${C.border}`,borderRadius:16,marginTop:4,
                  overflow:"hidden",boxShadow:"0 8px 28px rgba(107,92,231,.14)"}}>
                  {sugg.map(f=>(
                    <div key={f.id} onMouseDown={()=>{setSelected(f);setQuery(f.n);setShowSug(false);}}
                      style={{padding:"10px 14px",fontSize:13,color:C.navy,borderBottom:`1px solid ${C.border}`,
                        cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span>{f.n}</span>
                        {f.isCustom&&<Tag type="user"/>}
                        {f.warn==="combo"&&<Tag type="combo"/>}
                        {f.warn==="fat"&&<Tag type="fat"/>}
                        {f.warn==="sug"&&<Tag type="sug"/>}
                      </div>
                      <span style={{fontSize:11,color:C.mid,flexShrink:0,marginLeft:8}}>
                        {f.totalOnly?`${Math.round(f.kcal)}kcal/份`:`${f.kcal}kcal/100g`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* totalOnly food — show fixed serving info, no weight input */}
            {selected&&selected.totalOnly&&(
              <div style={{marginBottom:14,padding:"12px 14px",background:C.greenL,borderRadius:12}}>
                <div style={{fontSize:13,color:C.green,fontWeight:700,marginBottom:10}}>
                  📦 按份记录：{Math.round(selected.kcal)} kcal / 份
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:13,color:C.mid}}>份数</span>
                  <div style={{display:"flex",alignItems:"center",gap:0,border:`1.5px solid ${C.border}`,borderRadius:10,overflow:"hidden",background:C.white}}>
                    <button onClick={()=>setPortions(p=>Math.max(1,p-1))}
                      style={{width:36,height:36,border:"none",background:"none",fontSize:20,cursor:"pointer",color:C.mid,fontFamily:"inherit"}}>−</button>
                    <span style={{width:32,textAlign:"center",fontSize:16,fontWeight:800,color:C.navy}}>{portions}</span>
                    <button onClick={()=>setPortions(p=>p+1)}
                      style={{width:36,height:36,border:"none",background:"none",fontSize:20,cursor:"pointer",color:C.pri,fontFamily:"inherit"}}>＋</button>
                  </div>
                  <span style={{fontSize:13,color:C.mid}}>= <b style={{color:C.navy}}>{Math.round(selected.kcal*portions)} kcal</b></span>
                </div>
                <div style={{fontSize:12,color:C.mid,marginTop:8}}>
                  脂肪 {((selected.fat||0)*portions).toFixed(1)}g · 糖分 {((selected.sug||0)*portions).toFixed(1)}g
                </div>
              </div>
            )}

            {/* Weight input — only for non-totalOnly foods */}
            {((!selected&&sugg.length===0&&inputMode==="per100g")||(selected&&!selected.totalOnly))&&(
              <div style={{marginBottom:14}}>
                <label style={{fontSize:13,color:C.mid,display:"block",marginBottom:6}}>
                  {selected?<>克重 / 毫升 (g/ml) · <span style={{color:C.lite}}>{selected.kcal} kcal/100g</span></>:"克重 / 毫升 (g/ml)"}
                </label>
                <input style={inp} type="number" value={weight} placeholder="如 200"
                  onChange={e=>setWeight(e.target.value)}/>
              </div>
            )}

            {/* Custom food panel */}
            {query&&!selected&&sugg.length===0&&(
              <div style={{marginBottom:14,padding:14,background:C.priL,borderRadius:16}}>
                {/* Mode toggle */}
                <div style={{display:"flex",gap:6,marginBottom:14}}>
                  {[{id:"per100g",label:"📋 按标签/克重"},{id:"total",label:"🔢 按总热量"}].map(m=>(
                    <button key={m.id} onClick={()=>setInputMode(m.id)}
                      style={{flex:1,padding:"9px 4px",borderRadius:10,fontSize:12,
                        fontWeight:inputMode===m.id?700:500,
                        border:`1.5px solid ${inputMode===m.id?C.pri:C.border}`,
                        background:inputMode===m.id?C.pri:C.white,
                        color:inputMode===m.id?"#fff":C.mid,cursor:"pointer",fontFamily:"inherit"}}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {inputMode==="per100g"&&(
                  <>
                    <p style={{margin:"0 0 10px",fontSize:12,color:C.pri,fontWeight:600}}>
                      填写食品标签上的 /100g 或 /100ml 数值：
                    </p>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                      {[{label:"能量 kJ ✱",val:customKJ,set:setCustomKJ,ph:"如 1863",req:true},
                        {label:"脂肪 g",val:customF,set:setCustomF,ph:"可不填"},
                        {label:"糖分 g",val:customS,set:setCustomS,ph:"可不填"}].map(f=>(
                        <div key={f.label}>
                          <div style={{fontSize:11,marginBottom:4,color:f.req?C.pri:C.mid}}>{f.label}</div>
                          <input type="number" value={f.val} placeholder={f.ph}
                            onChange={e=>f.set(e.target.value)} style={{...inp,padding:"8px 10px",fontSize:13}}/>
                        </div>
                      ))}
                    </div>
                    {customKJ&&<p style={{margin:"8px 0 0",fontSize:11,color:C.mid}}>≈ {(+customKJ/KJ).toFixed(1)} kcal/100g · ✱ 必填，脂肪/糖分可不填</p>}
                  </>
                )}

                {inputMode==="total"&&(
                  <>
                    <p style={{margin:"0 0 10px",fontSize:12,color:C.pri,fontWeight:600}}>只知道总热量？直接填：</p>
                    <div style={{display:"flex",gap:8,marginBottom:8}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:11,color:C.mid,marginBottom:4}}>总热量</div>
                        <input type="number" value={totalCal} placeholder="如 382"
                          onChange={e=>setTotalCal(e.target.value)}
                          style={{...inp,fontSize:16,fontWeight:700}}/>
                      </div>
                      <div style={{flexShrink:0}}>
                        <div style={{fontSize:11,color:C.mid,marginBottom:4}}>单位</div>
                        <div style={{display:"flex",border:`1.5px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                          {["kcal","kj"].map(u=>(
                            <button key={u} onClick={()=>setTotalUnit(u)}
                              style={{padding:"9px 10px",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",
                                fontFamily:"inherit",background:totalUnit===u?C.pri:C.white,color:totalUnit===u?"#fff":C.mid}}>
                              {u.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {totalCal&&totalUnit==="kj"&&<p style={{margin:"0 0 10px",fontSize:11,color:C.mid}}>≈ {(+totalCal/KJ).toFixed(0)} kcal</p>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontSize:12,color:C.mid}}>脂肪/糖分 <span style={{color:C.lite}}>(可选)</span></span>
                      <button onClick={()=>estimateNutrition(query,Math.round(totalKcalValue))}
                        disabled={!totalKcalValue||isEst}
                        style={{fontSize:11,padding:"5px 12px",borderRadius:8,
                          background:totalKcalValue?C.pri:C.border,color:totalKcalValue?"#fff":C.lite,
                          border:"none",cursor:totalKcalValue?"pointer":"default",fontFamily:"inherit",fontWeight:700}}>
                        {isEst?"估算中…":"⚡ AI 估算"}
                      </button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      {[{label:"脂肪 g(本份)",val:estFat,set:setEstFat},{label:"糖分 g(本份)",val:estSug,set:setEstSug}].map(f=>(
                        <div key={f.label}>
                          <div style={{fontSize:11,color:C.mid,marginBottom:4}}>{f.label}</div>
                          <input type="number" value={f.val} placeholder="AI估算或手填"
                            onChange={e=>f.set(e.target.value)}
                            style={{...inp,padding:"8px 10px",fontSize:13,background:f.val?C.greenL:"#FAF9FF"}}/>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Preview */}
            {preview&&(
              <div style={{background:C.greenL,borderRadius:12,padding:"12px 14px",marginBottom:14,display:"flex",gap:20}}>
                {[{l:"热量",v:`${Math.round(preview.kcal)} kcal`},{l:"脂肪",v:`${preview.fat.toFixed(1)}g`},{l:"糖分",v:`${preview.sug.toFixed(1)}g`}].map(p=>(
                  <div key={p.l}>
                    <div style={{fontSize:11,color:C.mid}}>{p.l}</div>
                    <div style={{fontSize:16,fontWeight:800,color:C.navy}}>{p.v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Warning */}
            {selected?.warn&&(
              <div style={{marginBottom:14,padding:"10px 13px",borderRadius:12,
                background:selected.warn==="combo"?C.redL:C.amberL,
                fontSize:12,color:selected.warn==="combo"?C.red:C.amber}}>
                {selected.warn==="combo"&&"⚠️ 糖油混合物：脂肪与糖同时偏高，肥胖高风险食物"}
                {selected.warn==="fat"&&"🧈 高脂肪食品，建议控制每次摄入量"}
                {selected.warn==="sug"&&"🍬 高含糖饮料，建议以无糖饮品替代"}
              </div>
            )}

            <button onClick={handleAdd} style={canAdd?activeBtnStyle:disabledBtnStyle} disabled={!canAdd}>
              ＋ 添加到今日记录
            </button>
          </div>

          {/* Water shortcut */}
          <div style={{...card,textAlign:"center"}}>
            <p style={{margin:"0 0 12px",fontSize:13,color:C.mid}}>
              今日已喝 <b style={{color:C.green}}>{water}</b> / {settings.waterGoal} 杯水
            </p>
            <button onClick={()=>{setWater(w=>w+1);showToast("💧 已记录一杯水");}}
              style={{background:C.green,color:"#fff",border:"none",borderRadius:14,
                padding:"12px 40px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              💧 ＋ 一杯水
            </button>
          </div>
        </div>
      )}

      {/* ═══ HISTORY ═══ */}
      {tab==="history"&&(()=>{
        const pastDays = dateIndex.filter(d=>d.date!==dk);
        const trendFirst = weightLogs.length>=2 ? weightLogs[weightLogs.length-1] : null;
        const trendLast  = weightLogs.length>=2 ? weightLogs[0] : null;
        const trendDiff  = trendFirst ? (trendLast.weight-trendFirst.weight).toFixed(1) : null;
        const trendGood  = trendDiff < 0;
        return(
          <div>
            <div style={{padding:"24px 20px 6px"}}>
              <h1 style={{margin:0,fontSize:26,fontWeight:800,color:C.navy}}>历史记录</h1>
              <p style={{margin:"4px 0 0",fontSize:13,color:C.mid}}>全部记录 · 共 {pastDays.length} 天</p>
            </div>

            {trendFirst&&(
              <div style={{...card,display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:48,height:48,borderRadius:14,background:trendGood?C.greenL:C.redL,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>⚖️</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.navy}}>体重变化趋势</div>
                  <div style={{fontSize:13,color:C.mid,marginTop:3}}>
                    {trendFirst.weight} → {trendLast.weight} kg
                    <span style={{marginLeft:8,fontWeight:700,color:trendGood?C.green:C.red}}>
                      {trendGood?`↓ ${Math.abs(trendDiff)} kg`:`↑ ${trendDiff} kg`}
                    </span>
                  </div>
                  {settings.weightGoal&&<div style={{fontSize:11,color:C.lite,marginTop:2}}>目标 {settings.weightGoal} kg · 距目标 {(trendLast.weight-settings.weightGoal).toFixed(1)} kg</div>}
                </div>
              </div>
            )}

            <div style={{...card,background:`linear-gradient(135deg, ${C.priL} 0%, #F0ECFF 100%)`}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <div style={{width:42,height:42,borderRadius:12,background:C.pri,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📤</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.navy}}>导出记录</div>
                  <div style={{fontSize:12,color:C.mid,marginTop:2}}>CSV 格式，可用 Excel / Numbers 打开</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={exportAll}
                  style={{flex:1,padding:"11px 8px",borderRadius:12,background:C.pri,color:"#fff",
                    border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  📊 导出全部历史
                </button>
                <button onClick={()=>exportDay(dk)}
                  style={{flex:1,padding:"11px 8px",borderRadius:12,background:C.white,color:C.pri,
                    border:`1.5px solid ${C.pri}`,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  📄 导出今日
                </button>
              </div>
            </div>

            {pastDays.length===0&&(
              <div style={{textAlign:"center",padding:"60px 20px",color:C.lite}}>
                <div style={{fontSize:40,marginBottom:12}}>📅</div>
                <div style={{fontSize:14}}>暂无历史记录</div>
                <div style={{fontSize:12,marginTop:6}}>从今天开始记录，数据永久保存</div>
              </div>
            )}

            {pastDays.map(s=>(
              <DayCard key={s.date} summary={s}
                weightEntry={weightLogs.find(w=>w.date===s.date)}
                goalKcal={settings.goalKcal} waterGoal={settings.waterGoal}
                onExport={()=>exportDay(s.date)}/>
            ))}
          </div>
        );
      })()}

      {/* ═══ SETTINGS ═══ */}
      {tab==="settings"&&(
        <SettingsTab settings={settings} onSave={handleSaveSettings}
          userFoods={userFoods}
          onDeleteFood={id=>{setUserFoods(p=>p.filter(f=>f.id!==id));showToast("已删除");}}
          onUpdateFood={u=>setUserFoods(p=>p.map(f=>f.id===u.id?{...f,...u}:f))}
          onClearFoods={()=>{setUserFoods([]);showToast("✓ 食物库已清空");}}/>
      )}

      {/* ═══ NAV ═══ */}
      <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:430,background:C.white,borderTop:`1px solid ${C.border}`,
        display:"flex",padding:"6px 12px 18px",zIndex:100,gap:6}}>
        {NAV.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              cursor:"pointer",border:"none",padding:"8px 4px",fontFamily:"inherit",
              background:tab===t.id?C.priL:"transparent",
              borderRadius:14,
              color:tab===t.id?C.pri:C.mid,
              fontSize:10,fontWeight:tab===t.id?700:500,transition:"all .2s"}}>
            <span style={{fontSize:20,lineHeight:1}}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
