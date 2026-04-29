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
const todayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
};
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
  // 📝 个人常用食物
  {id:45,n:"吾岛希腊酸奶",kcal:63,fat:0,sug:0,cat:"🥚 蛋奶"},
  {id:46,n:"全麦吐司",kcal:306,fat:0,sug:0,cat:"🍚 主食"},
  {id:47,n:"黑芝麻粉",kcal:494,fat:0,sug:0,cat:"🥜 坚果"},
  {id:48,n:"蓝钻无糖杏仁奶",kcal:16,fat:0,sug:0,cat:"🥤 饮料"},
  {id:49,n:"benn黑巧",kcal:22,fat:0,sug:0,cat:"🍬 零食",totalOnly:true},
  {id:50,n:"胡萝卜",kcal:45,fat:0,sug:0,cat:"🥦 蔬菜",totalOnly:true},
  {id:51,n:"白煮蛋",kcal:78,fat:0,sug:0,cat:"🥚 蛋奶",totalOnly:true},
  {id:52,n:"茶叶蛋",kcal:84,fat:0,sug:0,cat:"🥚 蛋奶",totalOnly:true},
  {id:53,n:"燕麦(袋)",kcal:127,fat:0,sug:0,cat:"🍚 主食",totalOnly:true},
  {id:54,n:"燕麦粉",kcal:360,fat:0,sug:0,cat:"🍚 主食"},
  {id:55,n:"抹茶粉",kcal:370,fat:0,sug:0,cat:"🍵 其他"},
  {id:56,n:"豆奶",kcal:50,fat:0,sug:0,cat:"🌿 豆蔬"},
  {id:57,n:"巴西莓粉",kcal:380,fat:0,sug:0,cat:"🍎 水果"},
  {id:58,n:"摩可纳咖啡粉",kcal:276,fat:0,sug:0,cat:"☕ 饮料"},
  {id:59,n:"黄油",kcal:725,fat:82,sug:0,cat:"🧈 调味",warn:"fat"},
];

/* ── SUGAR BLACKLIST ── */
const BL = [
  // 含糖饮料
  {n:"可乐",note:"每罐约35g糖，纯液体糖炸弹",lv:"极危"},{n:"百事可乐",note:"同可乐，高果糖浆",lv:"极危"},
  {n:"雪碧",note:"碳酸+高果糖浆，无营养",lv:"极危"},{n:"芬达",note:"碳酸+高果糖浆",lv:"极危"},
  {n:"奶茶",note:"标准一杯含糖50-70g，超过每日上限",lv:"高危"},{n:"果汁饮料",note:"去纤维只剩糖，升糖比水果更快",lv:"高危"},
  {n:"运动饮料",note:"非运动场景纯粹喝糖水",lv:"高危"},{n:"脉动",note:"非运动场景纯粹喝糖水",lv:"高危"},
  {n:"维他命水",note:"打着健康旗号的加糖饮料",lv:"警惕"},{n:"蜂蜜水",note:"蜂蜜≈80%糖分",lv:"高危"},
  {n:"冰红茶",note:"加大量白砂糖或果糖",lv:"高危"},{n:"冰绿茶",note:"加大量白砂糖",lv:"高危"},
  {n:"酸梅汤",note:"糖分极高约50-80g/杯",lv:"极危"},{n:"杨枝甘露",note:"糖+淡奶油+芒果三重叠加",lv:"高危"},
  {n:"核桃露",note:"工厂版大量加糖和植物油",lv:"高危"},{n:"红牛",note:"糖+咖啡因双重刺激",lv:"高危"},
  {n:"能量饮料",note:"糖+咖啡因双重刺激",lv:"高危"},
  // 烘焙糕点
  {n:"蛋糕",note:"面粉+糖+黄油，三重叠加",lv:"高危"},{n:"奶油蛋糕",note:"面粉+糖+黄油，三重叠加",lv:"高危"},
  {n:"可颂",note:"高糖高黄油，典型糖油混合",lv:"高危"},{n:"牛角包",note:"高糖高黄油",lv:"高危"},
  {n:"马卡龙",note:"几乎纯糖，一颗约15g糖",lv:"极危"},{n:"泡芙",note:"奶油馅+酥皮，糖油双高",lv:"高危"},
  {n:"甜甜圈",note:"油炸+糖霜，糖油混合代表",lv:"高危"},{n:"华夫饼",note:"搭配糖浆/奶油后含糖量爆炸",lv:"高危"},
  {n:"月饼",note:"糖+油双高，一个相当于一顿饭热量",lv:"高危"},{n:"麻薯",note:"糯米+豆沙+糖，升糖极高",lv:"高危"},
  {n:"布朗尼",note:"黑巧克力+大量糖+黄油",lv:"高危"},{n:"饼干",note:"奥利奥/曲奇等糖油均超标",lv:"高危"},
  {n:"提拉米苏",note:"奶酪+糖+手指饼干",lv:"高危"},{n:"千层酥",note:"酥皮+奶油，糖油混合极品",lv:"高危"},
  // 糖果巧克力
  {n:"牛奶糖",note:"高糖+饱和脂肪，糖油双高",lv:"高危"},{n:"软糖",note:"明胶+葡萄糖浆，几乎纯糖",lv:"极危"},
  {n:"棒棒糖",note:"100%糖分，血糖双损",lv:"极危"},{n:"棉花糖",note:"砂糖+明胶，几乎零营养",lv:"极危"},
  {n:"白巧克力",note:"可可脂+大量糖，几乎无可可固形物",lv:"高危"},{n:"牛奶巧克力",note:"糖分远高于可可，约含50%+糖",lv:"高危"},
  {n:"士力架",note:"焦糖+花生+巧克力，糖油炸弹",lv:"高危"},{n:"德芙",note:"普通牛奶巧克力，糖量高",lv:"高危"},
  {n:"话梅糖",note:"糖+盐+添加剂，隐性糖",lv:"警惕"},{n:"果冻",note:"果味剂+大量糖+明胶",lv:"高危"},
  // 冰淇淋冷饮
  {n:"冰淇淋",note:"奶油+糖，标准糖油混合",lv:"高危"},{n:"雪糕",note:"巧克力外壳+冰淇淋，双糖油",lv:"高危"},
  {n:"奶昔",note:"糖+全脂奶油，热量接近一餐",lv:"高危"},{n:"雪花酪",note:"糖+植脂末，糖量高",lv:"高危"},
  // 超加工零食
  {n:"薯片",note:"油炸+调味粉含隐性糖，糖油混合",lv:"高危"},{n:"爆米花",note:"玉米+大量糖+黄油",lv:"高危"},
  {n:"仙贝",note:"精制米粉+糖+调味",lv:"高危"},{n:"辣条",note:"含糖调味油，糖油混合物",lv:"高危"},
  {n:"蜜汁腰果",note:"坚果裹糖后变零食",lv:"警惕"},{n:"糖炒坚果",note:"坚果本身健康但裹糖后变零食",lv:"警惕"},
  {n:"沙琪玛",note:"油炸面+糖浆粘合，糖油炸弹",lv:"高危"},{n:"蛋黄派",note:"糕体+奶油夹心+巧克力涂层",lv:"高危"},
  {n:"好丽友",note:"糕体+奶油夹心+巧克力",lv:"高危"},{n:"肉脯",note:"猪肉+大量糖腌制，隐性糖高",lv:"警惕"},
  // 早餐陷阱
  {n:"含糖麦片",note:"号称健康但含糖30-40%",lv:"警惕"},{n:"即食燕麦",note:"添加糖浆/蔗糖的速溶款",lv:"警惕"},
  {n:"格兰诺拉",note:"燕麦+蜂蜜+油，高糖高油",lv:"高危"},{n:"果酱",note:"含糖约60%",lv:"高危"},
  {n:"甜豆浆",note:"加糖豆浆等于糖饮料",lv:"高危"},{n:"油条",note:"油炸+糖饮，典型糖油早餐",lv:"高危"},
  {n:"蜂蜜吐司",note:"厚吐司+黄油+蜂蜜，糖油叠加",lv:"高危"},{n:"八宝粥",note:"糯米升糖+大量加糖",lv:"高危"},
  // 快餐外卖
  {n:"番茄酱",note:"含糖约25%，每勺约4g糖",lv:"警惕"},{n:"沙拉酱",note:"糖+植物油，高糖油",lv:"警惕"},
  {n:"BBQ酱",note:"糖是主要调味成分",lv:"高危"},{n:"烤肉酱",note:"糖分极高",lv:"高危"},
  {n:"糖醋排骨",note:"糖+油+淀粉，中式糖油代表",lv:"高危"},{n:"红烧肉",note:"大量砂糖/冰糖+猪油",lv:"高危"},
  {n:"蜜汁叉烧",note:"蜂蜜+糖腌+油炸/烤",lv:"高危"},{n:"咕噜肉",note:"糖+油+淀粉",lv:"高危"},
  // 看似健康陷阱
  {n:"低脂酸奶",note:"低脂=加更多糖补味",lv:"警惕"},{n:"能量棒",note:"部分品牌含20g+糖",lv:"警惕"},
  {n:"果干",note:"芒果干/葡萄干糖分极高，等于吃糖",lv:"高危"},{n:"蜂蜜",note:"≈80%糖分，不可大量食用",lv:"高危"},
  {n:"黑糖",note:"本质还是糖",lv:"警惕"},{n:"红糖",note:"本质还是糖",lv:"警惕"},
  {n:"无糖饼干",note:"含麦芽糊精，升糖比糖还高",lv:"警惕"},{n:"全麦面包",note:"很多是加色素的精制粉假全麦",lv:"警惕"},
  {n:"红枣",note:"含糖量很高，不可大把吃",lv:"警惕"},{n:"桂圆",note:"高糖水果，升糖快",lv:"高危"},
  {n:"荔枝",note:"高糖水果，升糖快",lv:"高危"},{n:"鲜榨果汁",note:"纤维去掉只剩高糖液体",lv:"高危"},
  // 中式小吃
  {n:"糖葫芦",note:"水果+糖衣，典型纯糖",lv:"极危"},{n:"驴打滚",note:"糯米+豆沙+糖",lv:"高危"},
  {n:"汤圆",note:"糯米+豆沙/黑芝麻+糖",lv:"高危"},{n:"元宵",note:"糯米粉+甜馅",lv:"高危"},
  {n:"糯米糕",note:"糯米+糖，升糖指数极高",lv:"高危"},{n:"年糕",note:"糯米+糖，升糖极高",lv:"高危"},
  {n:"麻花",note:"油炸面团+糖衣",lv:"高危"},{n:"沙琪玛",note:"油炸面+糖浆",lv:"高危"},
  // 加工乳制品
  {n:"炼乳",note:"牛奶+大量糖浓缩，糖分约55%",lv:"极危"},{n:"布丁",note:"糖+明胶+全脂奶",lv:"高危"},
  {n:"奶茶粉",note:"糖+植脂末+茶粉，糖油混合",lv:"高危"},{n:"调味牛奶",note:"普通牛奶+大量糖和香精",lv:"高危"},
  // 烧烤 & 串类
  {n:"烤串",note:"蜜汁/甜酱腌制+油脂，常见糖油混合",lv:"警惕"},
  {n:"串串",note:"麻辣底料+糖+油，热量密度高",lv:"警惕"},
  {n:"羊肉串",note:"烤制本身OK，蜜汁酱料含糖需注意",lv:"警惕"},
  {n:"烤鸡翅",note:"蜜汁/酱料腌制，含糖高",lv:"高危"},
  {n:"烤玉米",note:"刷黄油+糖，糖油叠加",lv:"警惕"},
  {n:"麻辣烫",note:"甜酱底料含糖，注意酱料用量",lv:"警惕"},
  {n:"关东煮",note:"甜酱汁含糖，淀粉类食材升糖快",lv:"警惕"},
  {n:"烤肠",note:"肠衣+糖腌+油炸，加工肉含隐性糖",lv:"高危"},
  {n:"热狗",note:"加工肉+糖+淀粉填充物",lv:"高危"},
];

const BL_LEVEL = {极危:{bg:"#ff1744",c:"#fff"},高危:{bg:"#ff6d00",c:"#fff"},警惕:{bg:"#ffd600",c:"#333"}};
const PM_STYLE = {bg:"#E8F4FF",c:"#2563EB"}; // personal mark style

// Returns blacklist match or null
const checkBL = (name) => {
  if (!name) return null;
  const n = name.replace(/\s/g,"").toLowerCase();
  return BL.find(b => n.includes(b.n.replace(/\s/g,"").toLowerCase()) || b.n.replace(/\s/g,"").toLowerCase().includes(n.slice(0,2)));
};

/* ── MINI COMPONENTS ── */
const Tag = ({type}) => {
  const m = {combo:{l:"糖油",bg:"#FDECEA",c:C.red},fat:{l:"高脂",bg:"#FEF3E6",c:C.amber},
              sug:{l:"高糖",bg:"#FEF3E6",c:C.amber},user:{l:"自定义",bg:C.priL,c:C.pri}};
  const t=m[type]; if(!t) return null;
  return <span style={{fontSize:10,background:t.bg,color:t.c,borderRadius:6,padding:"2px 7px",fontWeight:700}}>{t.l}</span>;
};

const SugarTag = ({name, personalMarks=[]}) => {
  const hit = checkBL(name);
  const pm = !hit && personalMarks.some(p=>p.n===name.replace(/\s×\d+$/,""));
  if(!hit && !pm) return null;
  if(pm) return(
    <span style={{fontSize:10,background:"#FEF3E6",color:C.amber,borderRadius:6,padding:"2px 7px",fontWeight:700}}>⚠️注意</span>
  );
  const lc = BL_LEVEL[hit.lv]||BL_LEVEL["警惕"];
  return(
    <span title={hit.note}
      style={{fontSize:10,background:lc.bg,color:lc.c,borderRadius:6,padding:"2px 7px",fontWeight:700,cursor:"help",flexShrink:0}}>
      ⚠️{hit.lv}
    </span>
  );
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

function DayCard({summary,weightEntry,goalKcal,waterGoal,onExport,onDeleteMeal,onUpdateWeight,personalMarks=[]}){
  const [meals,setMeals]=useState(null);
  const [open,setOpen]=useState(false);
  const toggle=async()=>{
    if(!open&&meals===null){const l=await S.get(`cal_logs_${summary.date}`);setMeals(l||[]);}
    setOpen(v=>!v);
  };
  // Sugar grade computed once meals are loaded
  const getSugarLabel=()=>{
    if(!meals||meals.length===0) return null;
    const score=meals.reduce((a,l)=>{
      const hit=checkBL(l.name);
      if(hit) return a+(hit.lv==="极危"?3:hit.lv==="高危"?2:1);
      if(personalMarks.some(p=>p.n===l.name.replace(/\s×\d+$/,""))) return a+2;
      if(l.isCombo||l.warn==="combo") return a+2;
      return a;
    },0);
    if(score===0) return {label:"控糖优秀",color:"#3a8f5c",bg:"#E8F8F0",icon:"🌿"};
    if(score<=2)  return {label:"基本达标",color:"#7A9E7E",bg:"#EDF7EE",icon:"👌"};
    if(score<=4)  return {label:"注意含糖",color:"#E8963A",bg:"#FEF4E8",icon:"⚡"};
    return          {label:"高糖警报", color:"#E05A5A",bg:"#FDECEA",icon:"🚨"};
  };
  const sugarLabel=getSugarLabel();
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
            {weightEntry&&<span style={{fontSize:11,background:C.greenL,color:C.green,borderRadius:8,padding:"2px 8px",fontWeight:600}}>⚖️ {weightEntry.weight} kg</span>}
          </div>
          <div style={{fontSize:12,color:C.mid,marginTop:3,display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span>{Math.round(summary.kcal)} kcal</span>
            {sugarLabel&&<span style={{background:sugarLabel.bg,color:sugarLabel.color,borderRadius:6,padding:"1px 6px",fontWeight:600,fontSize:11}}>{sugarLabel.icon}{sugarLabel.label}</span>}
            <span style={{color:C.lite}}>💧{summary.water}/{waterGoal}杯</span>
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
              fontSize:12,display:"flex",justifyContent:"space-between",alignItems:"center",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:5,flex:1,minWidth:0,flexWrap:"wrap"}}>
                <span style={{color:C.navy}}>{l.name}{l.weight?` · ${l.weight}g`:""}</span>
                <SugarTag name={l.name} personalMarks={personalMarks}/>
              </div>
              <span style={{color:C.mid,flexShrink:0}}>{Math.round(l.kcal)} kcal · {l.time}</span>
              <button onClick={async()=>{
                  const updated=meals.filter(x=>x.id!==l.id);
                  setMeals(updated);
                  await S.set(`cal_logs_${summary.date}`,updated);
                  // update summary in dateIndex via onDeleteMeal
                  onDeleteMeal&&onDeleteMeal(summary.date,updated);
                }}
                style={{border:"none",background:"none",color:C.lite,fontSize:18,
                  cursor:"pointer",lineHeight:1,padding:"0 2px",flexShrink:0}}>×</button>
            </div>
          ))}
          {/* Past weight entry */}
          <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:C.mid,flexShrink:0}}>⚖️ 体重</span>
            {weightEntry?(
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                <span style={{fontSize:13,fontWeight:700,color:C.navy}}>{weightEntry.weight} kg</span>
                <button onClick={()=>onUpdateWeight&&onUpdateWeight(summary.date,null)}
                  style={{border:"none",background:"none",color:C.lite,fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>
              </div>
            ):(
              <div style={{display:"flex",gap:6,flex:1}}>
                <input type="number" step="0.1" placeholder="补录体重 kg"
                  id={`wt-${summary.date}`}
                  style={{...inp,flex:1,padding:"6px 10px",fontSize:12}}/>
                <button onClick={()=>{
                    const v=parseFloat(document.getElementById(`wt-${summary.date}`)?.value);
                    if(!isNaN(v)&&v>0){onUpdateWeight&&onUpdateWeight(summary.date,v);}
                  }}
                  style={{padding:"6px 12px",borderRadius:10,border:"none",background:C.pri,
                    color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  记录
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SETTINGS TAB with editable food library ── */
function SettingsTab({settings,onSave,userFoods,onDeleteFood,onUpdateFood,onClearFoods,onBatchImport,onResetLib,onImport}){
  const [loc,setLoc]=useState(settings);
  const [showLib,setShowLib]=useState(false);
  const [editId,setEditId]=useState(null);
  const [ef,setEf]=useState({n:"",kcal:"",fat:"",sug:""});
  const [importText,setImportText]=useState("");
  const [showImport,setShowImport]=useState(false);
  const [showExportLib,setShowExportLib]=useState(null);
  const [libSearch,setLibSearch]=useState("");

  const startEdit=f=>{ setEditId(f.id); setEf({n:f.n,kcal:String(f.kcal),fat:String(f.fat||0),sug:String(f.sug||0)}); };
  const saveEdit=()=>{ onUpdateFood({id:editId,n:ef.n,kcal:+ef.kcal,fat:+ef.fat,sug:+ef.sug}); setEditId(null); };
  const libFuzzy=(name,q)=>{
    const n=name.toLowerCase();
    const terms=q.toLowerCase().trim().split(/\s+/);
    if(terms.length===1) return [...terms[0]].every(ch=>n.includes(ch));
    return terms.every(t=>n.includes(t));
  };
  const visibleFoods=libSearch?userFoods.filter(f=>libFuzzy(f.n,libSearch)):userFoods;

  const parseBatch=()=>{
    const lines=importText.split("\n").filter(l=>l.trim());
    const parsed=[];
    lines.forEach(line=>{
      const m1=line.match(/^(.+?)[\uff1a:]+\s*([\d.]+)\s*\/\s*(g|ml|克|毫升)/i);
      const m2=line.match(/^(.+?)[\uff1a:]+\s*([\d.]+)\s*(kcal|卡|大卡)?\s*\/\s*(袋|个|块|粒|片|根|条|份)/i);
      const m3=line.match(/^(.+?)[\uff1a:]+\s*([\d.]+)\s*\/\s*([\d.]+)\s*(g|ml)/i);
      if(m3){parsed.push({n:m3[1].trim(),kcal:Math.round((+m3[2]/+m3[3])*100*10)/10,fat:0,sug:0,cat:"📝 食物库",id:Date.now()+Math.random()});}
      else if(m1){parsed.push({n:m1[1].trim(),kcal:Math.round(+m1[2]*100*10)/10,fat:0,sug:0,cat:"📝 食物库",id:Date.now()+Math.random()});}
      else if(m2){parsed.push({n:m2[1].trim(),kcal:+m2[2],fat:0,sug:0,cat:"📝 食物库",totalOnly:true,id:Date.now()+Math.random()});}
    });
    if(parsed.length>0){onBatchImport(parsed);setImportText("");setShowImport(false);}
    return parsed.length;
  };

  const fields=[
    {key:"goalKcal",label:"每日热量目标",unit:"kcal",min:800,max:3000,step:50,hint:"轻度减脂建议 1200–1500 kcal"},
    {key:"waterGoal",label:"每日饮水目标",unit:"杯",min:4,max:16,step:1,hint:"每杯约 250ml，8 杯 ≈ 2L"},
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

      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",marginBottom:showLib?12:0}}
          onClick={()=>setShowLib(v=>!v)}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:C.navy}}>🍽️ 食物库</div>
            <div style={{fontSize:12,color:C.mid,marginTop:2}}>共 {userFoods.length} 种，全部可编辑</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={e=>{e.stopPropagation();setShowImport(v=>!v);setShowLib(true);}}
              style={{padding:"5px 11px",borderRadius:8,border:`1.5px solid ${C.pri}`,
                background:C.priL,color:C.pri,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              批量导入
            </button>
            <button onClick={e=>{
                e.stopPropagation();
                const lines=userFoods.map(f=>f.totalOnly?`${f.n}：${f.kcal}/份`:`${f.n}：${(f.kcal/100).toFixed(2)}/g`);
                const text=lines.join('\n');
                setShowExportLib(text);
              }}
              style={{padding:"5px 11px",borderRadius:8,border:`1.5px solid ${C.border}`,
                background:"none",color:C.mid,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              导出备份
            </button>
            <div style={{width:28,height:28,borderRadius:8,background:C.priL,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.pri}}>
              {showLib?"▲":"▼"}
            </div>
          </div>
        </div>

        {showLib&&(
          <>
            {showImport&&(
              <div style={{marginBottom:12,padding:13,background:"#FAFAFE",borderRadius:12,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:6}}>📋 批量导入卡路里备忘录</div>
                <div style={{fontSize:11,color:C.mid,marginBottom:8,lineHeight:1.8}}>
                  单位均为 <b style={{color:C.pri}}>kcal</b>（大卡）：<br/>
                  <code style={{background:C.bg,padding:"1px 5px",borderRadius:3}}>名称：X/g</code> 每克热量（如 0.63/g）·
                  <code style={{background:C.bg,padding:"1px 5px",borderRadius:3}}>名称：X/个</code> 每份热量（如 78/个）
                </div>
                <textarea value={importText} onChange={e=>setImportText(e.target.value)}
                  placeholder={"吾岛希腊酸奶：0.63/g\nbenn黑巧：22/块\n白煮蛋：78/个"}
                  style={{...inp,height:110,resize:"vertical",marginBottom:8,fontSize:12,fontFamily:"monospace"}}/>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{const n=parseBatch();showToast&&n>0?null:null;}}
                    style={{flex:1,padding:10,background:C.pri,color:"#fff",border:"none",
                      borderRadius:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                    解析并导入
                  </button>
                  <button onClick={()=>{setShowImport(false);setImportText("");}}
                    style={{padding:"10px 14px",background:C.border,color:C.mid,border:"none",
                      borderRadius:10,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>取消</button>
                </div>
              </div>
            )}

            <input style={{...inp,marginBottom:10}} value={libSearch}
              placeholder="搜索食物库…" onChange={e=>setLibSearch(e.target.value)}/>

            <div style={{maxHeight:380,overflowY:"auto"}}>
              {visibleFoods.map(f=>editId===f.id?(
                <div key={f.id} style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:6,marginBottom:8}}>
                    {[{l:"名称",k:"n",t:"text"},{l:"kcal",k:"kcal",t:"number"}].map(field=>(
                      <div key={field.k}>
                        <div style={{fontSize:10,color:C.mid,marginBottom:3}}>{field.l}</div>
                        <input type={field.t} value={ef[field.k]}
                          onChange={e=>setEf(p=>({...p,[field.k]:e.target.value}))}
                          style={{...inp,padding:"7px 9px",fontSize:12}}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={saveEdit} style={{flex:1,padding:"8px",borderRadius:10,background:C.pri,color:"#fff",
                      border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ 保存</button>
                    <button onClick={()=>setEditId(null)} style={{flex:1,padding:"8px",borderRadius:10,background:C.border,color:C.mid,
                      border:"none",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>取消</button>
                  </div>
                </div>
              ):(
                <div key={f.id} style={{display:"flex",alignItems:"center",gap:8,
                  padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <span style={{fontSize:13,color:C.navy,fontWeight:600}}>{f.n}</span>
                      {f.isBuiltin&&<span style={{fontSize:9,background:C.border,color:C.mid,borderRadius:4,padding:"1px 5px"}}>内置</span>}
                    </div>
                    <div style={{fontSize:11,color:C.mid,marginTop:2}}>
                      {f.totalOnly?`${Math.round(f.kcal)} kcal/份`:`${f.kcal} kcal/100g`}
                    </div>
                  </div>
                  <button onClick={()=>startEdit(f)}
                    style={{padding:"4px 10px",borderRadius:7,border:`1.5px solid ${C.border}`,
                      background:"none",color:C.pri,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>编辑</button>
                  <button onClick={()=>onDeleteFood(f.id)}
                    style={{border:"none",background:"none",color:C.lite,fontSize:18,cursor:"pointer",padding:"0 2px",lineHeight:1}}>×</button>
                </div>
              ))}
            </div>

          </>
        )}
      </div>

      {/* Food library export modal */}
      {showExportLib&&(
        <div style={{background:C.white,borderRadius:22,padding:"18px 16px",margin:"10px 16px",boxShadow:C.shadow}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontSize:14,fontWeight:700,color:C.navy}}>📋 食物库备份</div>
            <button onClick={()=>setShowExportLib(null)}
              style={{border:"none",background:"none",color:C.lite,fontSize:20,cursor:"pointer"}}>×</button>
          </div>
          <div style={{fontSize:12,color:C.mid,marginBottom:8}}>
            全选复制后存到备忘录，下次粘贴进「批量导入」即可恢复
          </div>
          <textarea readOnly value={showExportLib}
            ref={el=>{if(el){el.select();try{document.execCommand('copy');}catch{};}}}
            style={{...inp,height:200,resize:"none",fontSize:12,fontFamily:"monospace",marginBottom:8}}/>
          <button onClick={()=>{
              const ta=document.querySelector('textarea[readonly]');
              if(ta){ta.select();try{document.execCommand('copy');}catch{};}
            }}
            style={{width:"100%",padding:11,borderRadius:12,background:C.pri,color:"#fff",
              border:"none",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            📋 全选复制
          </button>
        </div>
      )}

      {/* Backup Import */}
      <BackupImport onImport={onImport}/>

    </div>
  );
}

/* ── BACKUP IMPORT ── */
function BackupImport({onImport}){
  const [text,setText]=useState("");
  const [preview,setPreview]=useState(null); // {date, rows, error}
  const [done,setDone]=useState(false);

  const parseCSV=raw=>{
    // Split lines, strip BOM and quotes
    const lines=raw.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
    // Find date line: "日期：YYYY/MM/DD" or "日期：YYYY-MM-DD"
    let date=null;
    for(const l of lines){
      const m=l.replace(/"/g,"").match(/日期[：:]\s*(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
      if(m){ date=`${m[1]}-${String(m[2]).padStart(2,"0")}-${String(m[3]).padStart(2,"0")}`; break; }
    }
    if(!date) return {error:"未找到日期行，请确认格式正确"};

    // Find data rows: time col looks like HH:MM
    const rows=[];
    for(const l of lines){
      const cols=l.split(",").map(c=>c.replace(/^"|"$/g,"").trim());
      if(cols.length<4) continue;
      const [time,name,qty,kcalStr]=cols;
      if(!/^\d{1,2}:\d{2}$/.test(time)) continue;
      const kcal=parseInt(kcalStr);
      if(!name||isNaN(kcal)) continue;
      // Parse qty: "24g"→weight=24, "1份"/"2份"→totalOnly
      const gm=qty.match(/^([\d.]+)\s*(g|ml|克|毫升)$/i);
      const pm=qty.match(/^([\d.]+)\s*份$/);
      rows.push({
        id:Date.now()+Math.random(),
        name,
        weight: gm ? +gm[1] : null,
        kcal,
        fat:0, sug:0,
        isCombo:false, warn:null,
        time,
        _portions: pm ? +pm[1] : null,
      });
    }
    if(rows.length===0) return {error:"未找到有效记录行，请检查格式"};
    return {date, rows};
  };

  const handlePreview=()=>{
    const result=parseCSV(text);
    setPreview(result);
    setDone(false);
  };

  const handleConfirm=()=>{
    if(!preview||preview.error) return;
    onImport(preview.date, preview.rows);
    setDone(true);
    setText(""); setPreview(null);
  };

  return(
    <div style={{background:C.white,borderRadius:22,padding:"18px 16px",margin:"10px 16px",boxShadow:C.shadow}}>
      <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>📥 导入备份记录</div>
      <div style={{fontSize:12,color:C.mid,marginBottom:12}}>
        将之前导出的 CSV 内容粘贴进来，自动恢复到对应日期
      </div>

      {done&&(
        <div style={{background:C.greenL,borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:13,color:C.green,fontWeight:600}}>
          ✓ 导入成功！
        </div>
      )}

      <textarea value={text} onChange={e=>{setText(e.target.value);setPreview(null);setDone(false);}}
        placeholder={"粘贴导出的 CSV 内容…\n\n例：\n\"减脂记录导出\"\n\"日期：2026/04/23\"\n\"时间\",\"食物名称\",\"用量\",\"热量(kcal)\",…\n\"12:45\",\"百醇饼干\",\"24g\",\"118\",…"}
        style={{...inp,height:120,resize:"vertical",marginBottom:8,fontSize:12,fontFamily:"monospace"}}/>

      {!preview&&(
        <button onClick={handlePreview} disabled={!text.trim()}
          style={{width:"100%",padding:11,borderRadius:12,fontSize:14,fontWeight:700,border:"none",
            cursor:text.trim()?"pointer":"default",fontFamily:"inherit",
            background:text.trim()?C.pri:C.border,color:text.trim()?"#fff":C.lite}}>
          解析预览
        </button>
      )}

      {preview&&!preview.error&&(
        <div>
          <div style={{background:C.priL,borderRadius:12,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:700,color:C.pri,marginBottom:8}}>
              📅 {preview.date} · {preview.rows.length} 条记录
            </div>
            {preview.rows.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,
                color:C.navy,padding:"4px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{flex:1}}>{r.time} · {r.name}{r.weight?` · ${r.weight}g`:""}</span>
                <span style={{fontWeight:600,flexShrink:0}}>{r.kcal} kcal</span>
                <button onClick={()=>setPreview(p=>({...p,rows:p.rows.filter((_,j)=>j!==i)}))}
                  style={{border:"none",background:"none",color:C.lite,fontSize:16,
                    cursor:"pointer",lineHeight:1,padding:"0 2px",flexShrink:0}}>×</button>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={handleConfirm}
              style={{flex:1,padding:11,borderRadius:12,fontSize:14,fontWeight:700,border:"none",
                cursor:"pointer",fontFamily:"inherit",background:C.pri,color:"#fff"}}>
              ✓ 确认导入
            </button>
            <button onClick={()=>{setPreview(null);}}
              style={{padding:"11px 16px",borderRadius:12,fontSize:13,border:"none",
                cursor:"pointer",fontFamily:"inherit",background:C.border,color:C.mid}}>
              取消
            </button>
          </div>
        </div>
      )}

      {preview?.error&&(
        <div style={{background:C.redL,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.red}}>
          ⚠️ {preview.error}
        </div>
      )}
    </div>
  );
}

/* ══════════════════ MAIN APP ════════════════════ */
export default function App(){
  const dk=todayKey();
  const [tab,setTab]=useState("today");
  const [settings,setSettings]=useState({goalKcal:1500,fatLimit:50,sugarLimit:50,waterGoal:8,weightGoal:55});
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
  const [portions,setPortions]=useState(1);
  const [recMode,setRecMode]=useState(null); // null|"unit"|"gml"
  const [personalMarks,setPersonalMarks]=useState([]); // foods flagged as sugar risk
  const [safeList,setSafeList]=useState([]);            // foods confirmed safe
  const [pendingClassify,setPendingClassify]=useState(null); // food name awaiting classification
  // Calendar state for history tab — Shanghai UTC+8
  const shToday = () => todayKey();
  const initMonth = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; };
  const [calMonth, setCalMonth] = useState(initMonth);
  const [calSelected, setCalSelected] = useState(null);

  useEffect(()=>{
    (async()=>{
      const s=await S.get("cal_settings"); if(s) setSettings(s);
      const l=await S.get(`cal_logs_${dk}`); if(l) setLogs(l);
      const w=await S.get(`cal_water_${dk}`); if(typeof w==="number") setWater(w);
      // Unified food library — seed from DB if first time
      const uf=await S.get("cal_food_library");
      if(uf) setUserFoods(uf);
      else {
        const seeded=DB.map(f=>({...f,isBuiltin:true}));
        setUserFoods(seeded);
      }
      const di=await S.get("cal_date_index"); if(di) setDateIndex(di);
      const wl=await S.get("cal_weight_logs"); if(wl) setWeightLogs(wl);
      const pm=await S.get("cal_personal_marks"); if(pm) setPersonalMarks(pm);
      const sl=await S.get("cal_safe_list"); if(sl) setSafeList(sl);
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
  useEffect(()=>{ if(ready) S.set("cal_food_library",userFoods); },[userFoods,ready]);
  useEffect(()=>{ if(ready) S.set("cal_date_index",dateIndex); },[dateIndex,ready]);
  useEffect(()=>{ if(ready) S.set("cal_weight_logs",weightLogs); },[weightLogs,ready]);
  useEffect(()=>{ if(ready) S.set("cal_personal_marks",personalMarks); },[personalMarks,ready]);
  useEffect(()=>{ if(ready) S.set("cal_safe_list",safeList); },[safeList,ready]);

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

  // Sugar performance: BL match + DB warn flags
  const sugarScore = logs.reduce((a,l)=>{
    const name = l.name.replace(/\s×\d+$/,"");
    const hit = checkBL(name);
    if(hit) {
      if(hit.lv==="极危") return a+3;
      if(hit.lv==="高危") return a+2;
      return a+1;
    }
    if(personalMarks.some(p=>p.n===name)) return a+2;
    if(l.isCombo||l.warn==="combo") return a+2;
    if(l.warn==="sug"||l.warn==="fat") return a+1;
    return a;
  },0);
  const sugarGrade = logs.length===0 ? null
    : sugarScore===0 ? {label:"控糖优秀",color:C.green,bg:C.greenL,icon:"🌿"}
    : sugarScore<=2  ? {label:"基本达标",color:"#7A9E7E",bg:"#EDF7EE",icon:"👌"}
    : sugarScore<=4  ? {label:"注意含糖",color:C.amber,bg:C.amberL,icon:"⚡"}
    : {label:"高糖警报",color:C.red,bg:C.redL,icon:"🚨"};

  // Fuzzy search: split query into chars/words, food must contain ALL of them
  const fuzzyMatch = (name, q) => {
    if (!q) return false;
    const n = name.toLowerCase();
    const terms = q.toLowerCase().trim().split(/\s+/);
    if (terms.length === 1) {
      // All chars must appear in name, order-independent
      return [...terms[0]].every(ch => n.includes(ch));
    }
    return terms.every(t => n.includes(t));
  };
  const sugg = query.length >= 1
    ? userFoods.filter(f => fuzzyMatch(f.n, query)).slice(0, 8)
    : [];

  const estimateNutrition=async(name,kcal)=>{
    if(!name||!kcal) return; setIsEst(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:100,
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

  // Effective mode: user's choice overrides library default
  const effectiveMode = recMode
    ?? (selected ? (selected.totalOnly ? "unit" : "gml") : null);

  const preview = !effectiveMode ? null
    : effectiveMode==="unit" && selected
      ? {kcal:selected.kcal*portions, fat:(selected.fat||0)*portions, sug:(selected.sug||0)*portions}
    : effectiveMode==="unit" && !selected && totalKcalValue>0
      ? {kcal:totalKcalValue*portions, fat:0, sug:0}
    : effectiveMode==="gml" && selected && weight && +weight>0
      ? {kcal:(selected.kcal*+weight)/100, fat:(selected.fat*+weight)/100, sug:(selected.sug*+weight)/100}
    : effectiveMode==="gml" && !selected && weight && +weight>0 && totalKcalValue>0
      ? {kcal:(totalKcalValue*+weight)/100, fat:0, sug:0}
    : null;

  const canAdd = !!effectiveMode && !!query && (
    effectiveMode==="unit"
      ? (selected ? true : totalKcalValue>0)
      : (selected ? (!!weight&&+weight>0) : (!!weight&&+weight>0&&totalKcalValue>0))
  );

  const resetForm=()=>{setQuery("");setSelected(null);setWeight("");setShowSug(false);setPortions(1);setRecMode(null);
    setCustomKJ("");setCustomF("");setCustomS("");setTotalCal("");setEstFat("");setEstSug("");setInputMode("per100g");};

  const handleAdd=()=>{
    if(!canAdd) return;
    let entry;
    const mode = effectiveMode;
    if(selected && mode==="unit"){
      const label = portions>1 ? `${selected.n} ×${portions}` : selected.n;
      entry={id:Date.now(),name:label,weight:null,
        kcal:selected.kcal*portions,fat:(selected.fat||0)*portions,sug:(selected.sug||0)*portions,
        isCombo:isCombo(selected),warn:selected.warn||null,
        time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})};
    } else if(selected && mode==="gml"){
      const w=+weight;
      entry={id:Date.now(),name:selected.n,weight:w,
        kcal:(selected.kcal*w)/100,fat:(selected.fat*w)/100,sug:(selected.sug*w)/100,
        isCombo:isCombo(selected),warn:selected.warn||null,
        time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})};
    } else if(!selected && mode==="unit"){
      const label = portions>1 ? `${query} ×${portions}` : query;
      entry={id:Date.now(),name:label,weight:null,
        kcal:totalKcalValue*portions,fat:0,sug:0,isCombo:false,warn:null,
        time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})};
      setUserFoods(prev=>prev.some(x=>x.n===query)?prev:[...prev,
        {id:Date.now()+1,n:query,kcal:Math.round(totalKcalValue*10)/10,fat:0,sug:0,cat:"📝 食物库",totalOnly:true}]);
    } else {
      // !selected && mode==="gml": kcal per 100g = totalCal value, weight = g input
      const w=+weight;
      entry={id:Date.now(),name:query,weight:w,
        kcal:(totalKcalValue*w)/100,fat:0,sug:0,isCombo:false,warn:null,
        time:new Date().toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})};
      setUserFoods(prev=>prev.some(x=>x.n===query)?prev:[...prev,
        {id:Date.now()+1,n:query,kcal:Math.round(totalKcalValue*10)/10,fat:0,sug:0,cat:"📝 食物库",totalOnly:false}]);
    }
    setLogs(p=>[...p,entry]);
    showToast(`✓ 已记录「${entry.name}」${Math.round(entry.kcal)} kcal`);
    // Trigger classify prompt if food is unknown (not in BL, personalMarks, safeList, or DB warn)
    const foodName = entry.name.replace(/\s×\d+$/,""); // strip ×N suffix
    const inBL = !!checkBL(foodName);
    const inPM = personalMarks.some(p=>p.n===foodName);
    const inSL = safeList.includes(foodName);
    const hasWarn = !!(entry.warn||entry.isCombo);
    if(!inBL && !inPM && !inSL && !hasWarn) {
      setTimeout(()=>setPendingClassify(foodName), 400);
    }
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

    const getSugarMark = (name) => {
      const hit = checkBL(name);
      if (hit) return hit.lv;
      if (personalMarks.some(p=>p.n===name.replace(/\s×\d+$/,""))) return "⚠️注意";
      return "";
    };

    const getQty = (l) => {
      if (l.weight) return `${l.weight}g`;
      const m = l.name.match(/×(\d+\.?\d*)$/);
      return m ? `${m[1]}份` : "1份";
    };

    const header = [["减脂记录导出"], [`日期：${label}`], []];
    const colHead = [["时间","食物名称","用量","热量(kcal)","控糖标记"]];
    const mealRows = meals.map(l => [
      l.time, l.name.replace(/\s×\d+\.?\d*$/,""), getQty(l), Math.round(l.kcal), getSugarMark(l.name),
    ]);
    const blank = [["","","","",""]];
    const total = [["【当日合计】","","",
      summary ? Math.round(summary.kcal) : meals.reduce((a,l)=>a+l.kcal,0),
      wEntry ? `体重 ${wEntry.weight} kg` : "",
    ]];
    const csv = buildCSV([...header, ...colHead, ...mealRows, ...blank, ...total]);
    showExport(`${label} 饮食记录`, csv);
  };

  const exportAll = async () => {
    if (dateIndex.length === 0) { showToast("暂无历史记录可导出"); return; }

    const getSugarMark = (name) => {
      const hit = checkBL(name);
      if (hit) return hit.lv;
      if (personalMarks.some(p=>p.n===name.replace(/\s×\d+$/,""))) return "⚠️注意";
      return "";
    };

    const header = [["减脂记录 · 全部历史"], [`导出时间：${new Date().toLocaleString("zh-CN")}`], []];
    const colHead = [["日期","时间","食物名称","用量","热量(kcal)","控糖标记","当日合计kcal","当日体重kg"]];
    const allRows = [];
    for (const s of dateIndex) {
      const meals = await S.get(`cal_logs_${s.date}`) || [];
      const wEntry = weightLogs.find(w => w.date === s.date);
      const d = new Date(s.date + "T00:00:00");
      const dateLabel = d.toLocaleDateString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit"});
      const getQty = (l) => {
        if (l.weight) return `${l.weight}g`;
        const m = l.name.match(/×(\d+\.?\d*)$/);
        return m ? `${m[1]}份` : "1份";
      };
      meals.forEach((l, i) => {
        allRows.push([
          i===0?dateLabel:"", l.time,
          l.name.replace(/\s×\d+\.?\d*$/,""),
          getQty(l), Math.round(l.kcal),
          getSugarMark(l.name),
          i===0?Math.round(s.kcal):"", i===0&&wEntry?wEntry.weight:"",
        ]);
      });
      if (meals.length===0) allRows.push([dateLabel,"—","—","—","—","",Math.round(s.kcal),wEntry?.weight||""]);
      allRows.push(Array(8).fill(""));
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

      {/* Classify modal */}
      {pendingClassify&&(
        <div style={{position:"fixed",inset:0,background:"rgba(28,22,54,.45)",zIndex:300,
          display:"flex",alignItems:"flex-end",justifyContent:"center"}}
          onClick={()=>setPendingClassify(null)}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:C.white,borderRadius:"22px 22px 0 0",padding:"22px 20px 40px",
              width:"100%",maxWidth:430}}>
            <div style={{width:36,height:4,borderRadius:2,background:C.border,margin:"0 auto 18px"}}/>
            <div style={{fontSize:15,fontWeight:800,color:C.navy,marginBottom:6}}>
              「{pendingClassify}」影响控糖吗？
            </div>
            <div style={{fontSize:13,color:C.mid,marginBottom:20}}>
              标记一次，以后自动识别，控糖评分更准确
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{
                  setPersonalMarks(p=>[...p,{n:pendingClassify,note:"个人标记：影响控糖"}]);
                  setPendingClassify(null);
                  showToast(`⚠️ 已标记「${pendingClassify}」为注意食物`);
                }}
                style={{flex:1,padding:"14px 8px",borderRadius:14,border:`1.5px solid ${C.amber}`,
                  background:C.amberL,color:C.amber,fontSize:14,fontWeight:700,
                  cursor:"pointer",fontFamily:"inherit"}}>
                ⚠️ 有影响，记住
              </button>
              <button onClick={()=>{
                  setSafeList(p=>[...p,pendingClassify]);
                  setPendingClassify(null);
                }}
                style={{flex:1,padding:"14px 8px",borderRadius:14,border:`1.5px solid ${C.green}`,
                  background:C.greenL,color:C.green,fontSize:14,fontWeight:700,
                  cursor:"pointer",fontFamily:"inherit"}}>
                ✅ 安全，跳过
              </button>
            </div>
            <button onClick={()=>setPendingClassify(null)}
              style={{width:"100%",marginTop:10,padding:"10px",border:"none",background:"none",
                color:C.lite,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              稍后再说
            </button>
          </div>
        </div>
      )}

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
              <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",justifyContent:"center",gap:10}}>
                <div>
                  <div style={{fontSize:11,color:C.mid,marginBottom:2}}>今日目标</div>
                  <div style={{fontSize:20,fontWeight:800,color:C.navy}}>{settings.goalKcal} <span style={{fontSize:13,fontWeight:400,color:C.mid}}>kcal</span></div>
                </div>
                {sugarGrade ? (
                  <div style={{padding:"8px 12px",borderRadius:12,background:sugarGrade.bg,
                    display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{sugarGrade.icon}</span>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:sugarGrade.color}}>{sugarGrade.label}</div>
                      <div style={{fontSize:11,color:C.mid}}>今日控糖表现</div>
                    </div>
                  </div>
                ) : (
                  <div style={{padding:"8px 12px",borderRadius:12,background:C.bg,
                    fontSize:12,color:C.lite}}>今日还没有记录</div>
                )}
              </div>
              </div>
            </div>
          </div>

          {/* Water + Weight — compact side by side */}
          <div style={{display:"flex",gap:10,margin:"0 16px 10px"}}>

            {/* 💧 Water */}
            <div style={{flex:1,background:C.white,borderRadius:20,padding:"14px",boxShadow:C.shadowSm}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.navy}}>💧 饮水</span>
                <span style={{fontSize:12,color:water>=settings.waterGoal?C.green:C.mid,fontWeight:water>=settings.waterGoal?700:400}}>
                  {water}/{settings.waterGoal}杯
                </span>
              </div>
              {/* Mini progress bar */}
              <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden",marginBottom:10}}>
                <div style={{height:"100%",borderRadius:3,transition:"width .4s ease",
                  background:water>=settings.waterGoal?"#0EA5E9":"#0EA5E9",
                  width:`${Math.min(water/settings.waterGoal*100,100)}%`}}/>
              </div>
              {/* +1 / −1 controls */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <button onClick={()=>setWater(w=>Math.max(0,w-1))}
                  style={{width:32,height:32,borderRadius:8,border:`1.5px solid ${C.border}`,
                    background:"none",fontSize:18,cursor:"pointer",color:C.mid,fontFamily:"inherit",
                    display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                <span style={{fontSize:20}}>{water>=settings.waterGoal?"🎉":"💧"}</span>
                <button onClick={()=>{if(water<settings.waterGoal*2)setWater(w=>w+1);showToast("💧 +1 杯水");}}
                  style={{width:32,height:32,borderRadius:8,border:"none",
                    background:"#0EA5E9",fontSize:18,cursor:"pointer",color:"#fff",fontFamily:"inherit",
                    display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>＋</button>
              </div>
            </div>

            {/* ⚖️ Weight */}
            <div style={{flex:1,background:C.white,borderRadius:20,padding:"14px",boxShadow:C.shadowSm}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.navy}}>⚖️ 体重</span>
                {settings.weightGoal&&<span style={{fontSize:11,color:C.mid}}>目标 {settings.weightGoal}kg</span>}
              </div>
              {todayWeight ? (
                <div>
                  <div style={{fontSize:22,fontWeight:800,color:C.navy,lineHeight:1,marginBottom:4}}>
                    {todayWeight.weight}<span style={{fontSize:12,fontWeight:400,color:C.mid}}> kg</span>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:600,
                      color:todayWeight.weight<=settings.weightGoal?C.green:C.pri}}>
                      {todayWeight.weight<=settings.weightGoal?"✅ 达标":`差 ${(todayWeight.weight-settings.weightGoal).toFixed(1)}kg`}
                    </span>
                    <button onClick={()=>setWeightLogs(p=>p.filter(x=>x.date!==dk))}
                      style={{border:"none",background:"none",color:C.lite,fontSize:16,cursor:"pointer",lineHeight:1}}>×</button>
                  </div>
                </div>
              ) : (
                <div>
                  {latestWeight&&latestWeight.date!==dk&&(
                    <div style={{fontSize:12,color:C.mid,marginBottom:8}}>
                      上次 <b style={{color:C.navy}}>{latestWeight.weight}</b> kg
                    </div>
                  )}
                  <div style={{display:"flex",gap:6}}>
                    <input type="number" step="0.1" value={weightInput}
                      onChange={e=>setWeightInput(e.target.value)}
                      placeholder="今日体重"
                      onKeyDown={e=>e.key==="Enter"&&logWeight()}
                      style={{...inp,flex:1,padding:"8px 10px",fontSize:13}}/>
                    <button onClick={logWeight} disabled={!weightInput}
                      style={{padding:"8px 10px",borderRadius:10,border:"none",fontSize:12,fontWeight:700,
                        cursor:weightInput?"pointer":"default",fontFamily:"inherit",
                        background:weightInput?C.pri:C.border,color:weightInput?"#fff":C.lite}}>
                      记录
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                      <SugarTag name={l.name} personalMarks={personalMarks}/>
                    </div>
                    <div style={{fontSize:12,color:C.mid,marginTop:3}}>
                      {l.weight?`${l.weight}g · `:""}{Math.round(l.kcal)} kcal
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
            {/* ── Step 1: Search ── */}
            <div style={{marginBottom:14,position:"relative"}}>
              <label style={{fontSize:13,color:C.mid,display:"block",marginBottom:6}}>食物名称</label>
              <input style={inp} value={query} placeholder="搜索，如：鸡胸肉、白米饭…"
                onChange={e=>{setQuery(e.target.value);setSelected(null);setShowSug(true);setRecMode(null);setWeight("");setTotalCal("");setPortions(1);}}
                onFocus={()=>setShowSug(true)}/>
              {showSug&&sugg.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:60,
                  background:C.white,border:`1px solid ${C.border}`,borderRadius:16,marginTop:4,
                  overflow:"hidden",boxShadow:"0 8px 28px rgba(107,92,231,.14)"}}>
                  {sugg.map(f=>(
                    <div key={f.id} onMouseDown={()=>{setSelected(f);setQuery(f.n);setShowSug(false);setRecMode(null);setWeight("");setPortions(1);}}
                      style={{padding:"11px 14px",fontSize:13,color:C.navy,borderBottom:`1px solid ${C.border}`,
                        cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{fontWeight:500}}>{f.n}</span>
                        {f.warn==="combo"&&<Tag type="combo"/>}
                        {f.warn==="fat"&&<Tag type="fat"/>}
                        {f.warn==="sug"&&<Tag type="sug"/>}
                      </div>
                      <span style={{fontSize:11,color:C.mid,flexShrink:0,marginLeft:8}}>
                        {f.totalOnly?`${Math.round(f.kcal)} kcal/份`:`${f.kcal} kcal/100g`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Step 2: Choose mode (shown once food is typed/selected) ── */}
            {(selected||query)&&(
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                {[
                  {id:"unit", label:"📦 按份 / 个", hint: selected&&!selected.totalOnly ? "切换为按份" : null},
                  {id:"gml",  label:"⚖️ 按 g / ml",  hint: selected&&selected.totalOnly  ? "切换为按重量" : null},
                ].map(m=>{
                  const active = effectiveMode===m.id;
                  return(
                    <button key={m.id} onClick={()=>{setRecMode(m.id);setWeight("");setPortions(1);setTotalCal("");}}
                      style={{flex:1,padding:"10px 6px",borderRadius:12,fontSize:13,fontWeight:active?700:500,
                        border:`1.5px solid ${active?C.pri:C.border}`,
                        background:active?C.pri:"transparent",
                        color:active?"#fff":C.mid,cursor:"pointer",fontFamily:"inherit",transition:"all .15s"}}>
                      {m.label}
                      {m.hint&&<div style={{fontSize:10,opacity:.75,marginTop:2}}>{m.hint}</div>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Step 3a: 按份 ── */}
            {effectiveMode==="unit"&&(
              <div style={{marginBottom:14}}>
                {/* For new food: need kcal/份 first */}
                {!selected&&(
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:13,color:C.mid,display:"block",marginBottom:6}}>每份热量</label>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <input type="number" value={totalCal} placeholder="如 22"
                        onChange={e=>setTotalCal(e.target.value)}
                        style={{...inp,flex:1,fontSize:16,fontWeight:700}}/>
                      <div style={{display:"flex",border:`1.5px solid ${C.border}`,borderRadius:10,overflow:"hidden",flexShrink:0}}>
                        {["kcal","kj"].map(u=>(
                          <button key={u} onClick={()=>setTotalUnit(u)}
                            style={{padding:"9px 10px",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",
                              fontFamily:"inherit",background:totalUnit===u?C.pri:C.white,color:totalUnit===u?"#fff":C.mid}}>
                            {u.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    {totalCal&&totalUnit==="kj"&&<p style={{margin:"5px 0 0",fontSize:11,color:C.mid}}>≈ {(+totalCal/KJ).toFixed(0)} kcal/份</p>}
                  </div>
                )}
                {/* Portions stepper */}
                <label style={{fontSize:13,color:C.mid,display:"block",marginBottom:8}}>
                  份数
                  {selected&&<span style={{color:C.lite}}> · {Math.round(selected.kcal)} kcal/份</span>}
                </label>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{display:"flex",alignItems:"center",border:`1.5px solid ${C.border}`,borderRadius:12,overflow:"hidden",background:C.white}}>
                    <button onClick={()=>setPortions(p=>Math.max(0.5,+(p-0.5).toFixed(1)))}
                      style={{width:42,height:42,border:"none",background:"none",fontSize:22,cursor:"pointer",color:C.mid,fontFamily:"inherit"}}>−</button>
                    <span style={{minWidth:36,textAlign:"center",fontSize:18,fontWeight:800,color:C.navy}}>{portions}</span>
                    <button onClick={()=>setPortions(p=>+(p+0.5).toFixed(1))}
                      style={{width:42,height:42,border:"none",background:"none",fontSize:22,cursor:"pointer",color:C.pri,fontFamily:"inherit"}}>＋</button>
                  </div>
                  {preview&&<span style={{fontSize:15,fontWeight:700,color:C.navy}}>{Math.round(preview.kcal)} kcal</span>}
                </div>
              </div>
            )}

            {/* ── Step 3b: 按 g/ml ── */}
            {effectiveMode==="gml"&&(
              <div style={{marginBottom:14}}>
                {/* For new food: need kcal/100g first */}
                {!selected&&(
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:13,color:C.mid,display:"block",marginBottom:6}}>每 100g/ml 热量</label>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <input type="number" value={totalCal} placeholder="如 116"
                        onChange={e=>setTotalCal(e.target.value)}
                        style={{...inp,flex:1,fontSize:16,fontWeight:700}}/>
                      <div style={{display:"flex",border:`1.5px solid ${C.border}`,borderRadius:10,overflow:"hidden",flexShrink:0}}>
                        {["kcal","kj"].map(u=>(
                          <button key={u} onClick={()=>setTotalUnit(u)}
                            style={{padding:"9px 10px",fontSize:12,fontWeight:700,border:"none",cursor:"pointer",
                              fontFamily:"inherit",background:totalUnit===u?C.pri:C.white,color:totalUnit===u?"#fff":C.mid}}>
                            {u.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    {totalCal&&totalUnit==="kj"&&<p style={{margin:"5px 0 0",fontSize:11,color:C.mid}}>≈ {(+totalCal/KJ).toFixed(0)} kcal/100g</p>}
                  </div>
                )}
                <label style={{fontSize:13,color:C.mid,display:"block",marginBottom:6}}>
                  克重 / 毫升
                  {selected&&<span style={{color:C.lite}}> · {selected.kcal} kcal/100g</span>}
                </label>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <input type="number" value={weight} placeholder="如 200"
                    onChange={e=>setWeight(e.target.value)}
                    style={{...inp,flex:1}}/>
                  {preview&&<span style={{fontSize:15,fontWeight:700,color:C.navy,flexShrink:0}}>{Math.round(preview.kcal)} kcal</span>}
                </div>
              </div>
            )}

            {/* Warning */}
            {selected?.warn&&(
              <div style={{marginBottom:14,padding:"10px 13px",borderRadius:12,
                background:selected.warn==="combo"?C.redL:C.amberL,
                fontSize:12,color:selected.warn==="combo"?C.red:C.amber}}>
                {selected.warn==="combo"&&"⚠️ 糖油混合物：脂肪与糖同时偏高"}
                {selected.warn==="fat"&&"🧈 高脂肪食品，建议控制摄入量"}
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
              style={{background:"#0EA5E9",color:"#fff",border:"none",borderRadius:14,
                padding:"12px 40px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              💧 ＋ 一杯水
            </button>
          </div>
        </div>
      )}

      {/* ═══ HISTORY ═══ */}
      {tab==="history"&&(()=>{
        // weightLogs is sorted desc by date (newest first)
        // Latest = today's or most recent weight
        // Previous = the one before latest that has a record
        const todaySH = shToday();
        const latestLog = weightLogs[0] || null;
        const prevLog = weightLogs.length>=2 ? weightLogs[1] : null;
        const trendDiff = (latestLog&&prevLog) ? (latestLog.weight-prevLog.weight).toFixed(1) : null;
        const trendGood = trendDiff!==null && trendDiff < 0;
        const pastDays = dateIndex.filter(d=>d.date!==todaySH);

        // Calendar helpers
        const [calY, calM] = calMonth.split("-").map(Number);
        const prevMonth = () => {
          const d = new Date(calY, calM-2, 1);
          setCalMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
          setCalSelected(null);
        };
        const nextMonth = () => {
          const d = new Date(calY, calM, 1);
          setCalMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
          setCalSelected(null);
        };

        // Build calendar grid (Mon-Sun)
        const firstDay = new Date(calY, calM-1, 1);
        const lastDay  = new Date(calY, calM, 0);
        const startDow = (firstDay.getDay()+6)%7; // 0=Mon
        const daysInMonth = lastDay.getDate();
        const cells = [];
        for(let i=0; i<startDow; i++) cells.push(null);
        for(let d=1; d<=daysInMonth; d++) cells.push(d);
        while(cells.length%7!==0) cells.push(null);

        const recordDates = new Set(dateIndex.map(d=>d.date));
        const selectedSummary = calSelected ? dateIndex.find(d=>d.date===calSelected) : null;

        return(
          <div>
            <div style={{padding:"24px 20px 6px"}}>
              <h1 style={{margin:0,fontSize:26,fontWeight:800,color:C.navy}}>历史记录</h1>
              <p style={{margin:"4px 0 0",fontSize:13,color:C.mid}}>共 {pastDays.length} 天记录 · UTC+8</p>
            </div>

            {/* ── Calendar ── */}
            <div style={card}>
              {/* Month nav */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                <button onClick={prevMonth}
                  style={{width:34,height:34,borderRadius:10,border:`1.5px solid ${C.border}`,
                    background:C.white,color:C.mid,fontSize:18,cursor:"pointer",display:"flex",
                    alignItems:"center",justifyContent:"center"}}>‹</button>
                <span style={{fontSize:15,fontWeight:800,color:C.navy}}>
                  {calY} 年 {calM} 月
                </span>
                <button onClick={nextMonth}
                  style={{width:34,height:34,borderRadius:10,border:`1.5px solid ${C.border}`,
                    background:C.white,color:C.mid,fontSize:18,cursor:"pointer",display:"flex",
                    alignItems:"center",justifyContent:"center"}}>›</button>
              </div>

              {/* Weekday header */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:6,gap:2}}>
                {["一","二","三","四","五","六","日"].map(d=>(
                  <div key={d} style={{textAlign:"center",fontSize:11,color:C.lite,fontWeight:600,padding:"4px 0"}}>{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
                {cells.map((d,i)=>{
                  if(!d) return <div key={i}/>;
                  const dateStr=`${calY}-${String(calM).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                  const isToday=dateStr===todaySH;
                  const hasRecord=recordDates.has(dateStr);
                  const isSel=calSelected===dateStr;
                  const isFuture=dateStr>todaySH;
                  return(
                    <div key={i} onClick={()=>!isFuture&&setCalSelected(isSel?null:dateStr)}
                      style={{
                        textAlign:"center",padding:"7px 2px",borderRadius:10,
                        fontSize:13,fontWeight:isToday||hasRecord?700:400,
                        cursor:isFuture?"default":"pointer",
                        background:isSel?C.pri:isToday?C.priL:hasRecord?"#F0ECFF":"transparent",
                        color:isSel?"#fff":isToday?C.pri:hasRecord?C.pri:isFuture?C.lite:C.navy,
                        transition:"all .15s",position:"relative",
                      }}>
                      {d}
                      {hasRecord&&!isSel&&(
                        <div style={{position:"absolute",bottom:3,left:"50%",transform:"translateX(-50%)",
                          width:4,height:4,borderRadius:"50%",background:C.pri}}/>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{display:"flex",gap:14,marginTop:12,paddingTop:10,
                borderTop:`1px solid ${C.border}`,justifyContent:"center"}}>
                {[{bg:C.priL,c:C.pri,l:"今天"},{bg:"#F0ECFF",c:C.pri,l:"有记录",dot:true},{bg:"transparent",c:C.navy,l:"无记录"}].map(x=>(
                  <div key={x.l} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:C.mid}}>
                    <div style={{width:14,height:14,borderRadius:4,background:x.bg,
                      border:`1px solid ${C.border}`,position:"relative",flexShrink:0}}>
                      {x.dot&&<div style={{position:"absolute",bottom:2,left:"50%",
                        transform:"translateX(-50%)",width:3,height:3,borderRadius:"50%",background:C.pri}}/>}
                    </div>
                    {x.l}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Selected day detail ── */}
            {calSelected&&(
              <div style={card}>
                {selectedSummary ? (
                  <DayCard summary={selectedSummary} personalMarks={personalMarks}
                    weightEntry={weightLogs.find(w=>w.date===calSelected)}
                    goalKcal={settings.goalKcal} waterGoal={settings.waterGoal}
                    onExport={()=>exportDay(calSelected)} onUpdateWeight={(date,w)=>{setWeightLogs(prev=>w===null?prev.filter(x=>x.date!==date):[{id:Date.now(),date,weight:w},...prev.filter(x=>x.date!==date)].sort((a,b)=>b.date.localeCompare(a.date)));}} personalMarks={personalMarks} onDeleteMeal={(date,updated)=>{setDateIndex(prev=>prev.map(d=>d.date===date?{...d,kcal:updated.reduce((a,l)=>a+l.kcal,0)}:d));}} inline/>
                ) : calSelected===todaySH ? (
                  <div style={{textAlign:"center",padding:"16px 0",color:C.mid,fontSize:13}}>
                    今日记录请在「今日」tab 查看
                  </div>
                ) : (
                  <div style={{textAlign:"center",padding:"16px 0",color:C.lite,fontSize:13}}>
                    {calSelected} 暂无记录
                  </div>
                )}
              </div>
            )}

            {/* ── Weight trend ── */}
            {latestLog&&prevLog&&(
              <div style={{...card,display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:48,height:48,borderRadius:14,background:trendGood?C.greenL:C.redL,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>⚖️</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.navy}}>体重变化趋势</div>
                  <div style={{fontSize:13,color:C.mid,marginTop:3}}>
                    <span style={{color:C.lite,fontSize:11}}>{prevLog.date}</span>
                    {" "}{prevLog.weight} → {latestLog.weight} kg
                    <span style={{marginLeft:8,fontWeight:700,color:trendGood?C.green:C.red}}>
                      {trendGood?`↓ ${Math.abs(trendDiff)} kg`:`↑ ${trendDiff} kg`}
                    </span>
                  </div>
                  {settings.weightGoal&&<div style={{fontSize:11,color:C.lite,marginTop:2}}>目标 {settings.weightGoal} kg · 距目标 {(latestLog.weight-settings.weightGoal).toFixed(1)} kg</div>}
                </div>
              </div>
            )}

            {/* ── Export ── */}
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
                <button onClick={()=>exportDay(todaySH)}
                  style={{flex:1,padding:"11px 8px",borderRadius:12,background:C.white,color:C.pri,
                    border:`1.5px solid ${C.pri}`,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                  📄 导出今日
                </button>
              </div>
            </div>

            {/* ── Recent list (last 7 days with records) ── */}
            {pastDays.length>0&&(
              <div style={{padding:"0 16px 6px"}}>
                <div style={{fontSize:13,fontWeight:700,color:C.mid,marginBottom:4}}>最近记录</div>
              </div>
            )}
            {pastDays.slice(0,10).map(s=>(
              <DayCard key={s.date} summary={s}
                weightEntry={weightLogs.find(w=>w.date===s.date)}
                goalKcal={settings.goalKcal} waterGoal={settings.waterGoal}
                onExport={()=>exportDay(s.date)} onUpdateWeight={(date,w)=>{setWeightLogs(prev=>w===null?prev.filter(x=>x.date!==date):[{id:Date.now(),date,weight:w},...prev.filter(x=>x.date!==date)].sort((a,b)=>b.date.localeCompare(a.date)));}} personalMarks={personalMarks} onDeleteMeal={(date,updated)=>{setDateIndex(prev=>prev.map(d=>d.date===date?{...d,kcal:updated.reduce((a,l)=>a+l.kcal,0)}:d));}}/>
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
          onClearFoods={()=>{setUserFoods([]);showToast("✓ 食物库已清空");}}
          onBatchImport={items=>{
            setUserFoods(prev=>{
              const names=new Set(prev.map(f=>f.n));
              const newItems=items.filter(i=>!names.has(i.n));
              showToast(`✓ 导入 ${newItems.length} 种食物`);
              return [...prev,...newItems];
            });
          }}
          onResetLib={()=>{
            const seeded=DB.map(f=>({...f,isBuiltin:true}));
            setUserFoods(prev=>{
              const names=new Set(prev.map(f=>f.n));
              const toAdd=seeded.filter(f=>!names.has(f.n));
              showToast(`✓ 已恢复 ${toAdd.length} 个内置食物`);
              return [...prev,...toAdd];
            });
          }}
          onImport={async(date, rows)=>{
            // Merge with existing logs for that date (don't overwrite)
            const existing = await S.get(`cal_logs_${date}`) || [];
            const merged = [...existing, ...rows];
            await S.set(`cal_logs_${date}`, merged);
            // Update dateIndex
            const kcal=merged.reduce((a,l)=>a+l.kcal,0);
            const fat=merged.reduce((a,l)=>a+(l.fat||0),0);
            const sug=merged.reduce((a,l)=>a+(l.sug||0),0);
            setDateIndex(prev=>{
              const rest=prev.filter(d=>d.date!==date);
              return [{date,kcal,fat,sug,water:0},...rest].sort((a,b)=>b.date.localeCompare(a.date));
            });
            // If today, reload logs
            if(date===dk){ setLogs(merged); }
            showToast(`✓ 已导入 ${date} · ${rows.length} 条记录`);
          }}
        />
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
