const CONFIG = {
  shopName: "Кофейня «Зерно»",
  address: "📍 г. Минск, ул. Ломоносова, 6\n🕒 Время работы: ежедневно с 07:00 до 19:00",
  lat: 53.9261,
  lon: 27.5936,
  barista: "zerno_barista",
  bonus: 100
};

function makeArt(bg1, bg2, emoji, label) {
  const svg = `<svg xmlns="http://w3.org" width="400" height="300" viewBox="0 0 400 300">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${bg1}"/><stop offset="100%" stop-color="${bg2}"/></linearGradient></defs>
    <rect width="400" height="300" rx="24" fill="url(#g)"/>
    <circle cx="330" cy="60" r="70" fill="rgba(255,255,255,0.12)"/>
    <text x="200" y="145" font-size="86" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="200" y="240" font-family="sans-serif" font-size="22" font-weight="bold" fill="rgba(255,255,255,0.92)" text-anchor="middle">${label}</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

const CATS = [
  { id: "coffee", t: "☕ Кофе", s: "Классика и авторский", i: makeArt("#6f4e37", "#3e2723", "☕", "100% АРАБИКА") },
  { id: "combo", t: "🥐 Комбо", s: "Выгодные наборы", i: makeArt("#d97706", "#92400e", "🥐", "ВЫГОДНЫЙ СЕТ") },
  { id: "iced", t: "🧊 Напитки", s: "Айс-кофе и лимонады", i: makeArt("#0284c7", "#1e3a8a", "🧊", "ОСВЕЖАЕТ") },
  { id: "food", t: "🥪 Еда", s: "Сэндвичи и десерты", i: makeArt("#059669", "#064e3b", "🥪", "СВЕЖЕЕ") }
];

const PRODS = [
  { id: 1, c: "coffee", n: "Капучино (350 мл)", d: "100% арабика и плотная молочная пенка", p: 6.00, i: makeArt("#78350f", "#451a03", "☕", "350 МЛ") },
  { id: 2, c: "coffee", n: "Флэт Уайт (250 мл)", d: "Двойной эспрессо с бархатной микропеной", p: 6.50, i: makeArt("#5c4033", "#2b1b17", "🥛", "250 МЛ") },
  { id: 3, c: "combo", n: "Круассан + Капучино", d: "Хрустящий круассан и классический капучино", p: 9.50, i: makeArt("#ea580c", "#7c2d12", "🥐", "ХИТ УТРА") },
  { id: 4, c: "combo", n: "Сырники + Американо", d: "Тёплые сырники со сметаной и чёрный кофе", p: 11.00, i: makeArt("#d97706", "#78350f", "🥞", "ЗАВТРАК") },
  { id: 5, c: "iced", n: "Айс Латте Карамель", d: "Охлаждённый кофе со льдом и карамелью", p: 7.00, i: makeArt("#0ea5e9", "#0369a1", "🧋", "СО ЛЬДОМ") },
  { id: 6, c: "iced", n: "Эспрессо-тоник", d: "Бодрящий эспрессо со швепсом и лаймом", p: 7.50, i: makeArt("#10b981", "#047857", "🍋", "ТОНИК") },
  { id: 7, c: "food", n: "Сэндвич с индейкой", d: "Чиабатта, филе индейки, творожный сыр", p: 8.50, i: makeArt("#16a34a", "#14532d", "🥪", "СЫТНО") },
  { id: 8, c: "food", n: "Чизкейк Нью-Йорк", d: "Нежный сливочный десерт на песочной основе", p: 7.50, i: makeArt("#db2777", "#831843", "🍰", "ДЕСЕРТ") }
];

let cart = {};
let activeCat = null;
let searchQ = "";

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function render() {
  const box = document.getElementById("mainContent");
  box.innerHTML = "";

  if (searchQ.trim() !== "") {
    const list = PRODS.filter(p => p.n.toLowerCase().includes(searchQ.toLowerCase()));
    const h = el("div", "", "Найдено (" + list.length + ")");
    h.style.cssText = "font-weight:700;margin-bottom:12px";
    box.appendChild(h);
    box.appendChild(buildGrid(list));
    return;
  }

  if (activeCat) {
    const cObj = CATS.find(c => c.id === activeCat);
    const head = el("div");
    head.style.cssText = "display:flex;align-items:center;gap:10px;margin-bottom:12px";
    const back = el("button", "geo", "← Назад");
    back.onclick = function() { activeCat = null; render(); };
    head.appendChild(back);
    head.appendChild(el("b", "", cObj.t));
    box.appendChild(head);
    box.appendChild(buildGrid(PRODS.filter(p => p.c === activeCat)));
    return;
  }

  const grid = el("div", "grid");
  CATS.forEach(c => {
    const card = el("div", "cc");
    const info = el("div");
    info.appendChild(el("b", "", c.t));
    const sub = el("div", "", c.s);
    sub.style.cssText = "font-size:12px;color:var(--hint)";
    info.appendChild(sub);
    const img = el("img");
    img.src = c.i;
    card.appendChild(info);
    card.appendChild(img);
    card.onclick = function() { activeCat = c.id; render(); };
    grid.appendChild(card);
  });
  box.appendChild(grid);
}
function buildGrid(list) {
  if (!list.length) return el("p", "", "Ничего не найдено 😔");
  const grid = el("div", "grid");
  list.forEach(p => {
    const card = el("div", "pc");
    const img = el("img");
    img.src = p.i;
    const body = el("div", "pb");
    const top = el("div");
    const title = el("b", "", p.n);
    title.style.fontSize = "14px";
    const desc = el("div", "", p.d);
    desc.style.cssText = "font-size:11px;color:var(--hint);margin:4px 0 8px";
    top.appendChild(title);
    top.appendChild(desc);

    const bot = el("div");
    const price = el("div", "", p.p.toFixed(2) + " BYN");
    price.style.cssText = "font-weight:700;margin-bottom:8px";
    bot.appendChild(price);

    const q = cart[p.id] || 0;
    if (q === 0) {
      const btn = el("button", "ab", "+ В корзину");
      btn.onclick = function() { chg(p.id, 1); };
      bot.appendChild(btn);
    } else {
      const cnt = el("div", "cnt");
      const m = el("button", "", "−");
      m.onclick = function() { chg(p.id, -1); };
      const s = el("span", "", q + " шт");
      const pl = el("button", "", "+");
      pl.onclick = function() { chg(p.id, 1); };
      cnt.appendChild(m); cnt.appendChild(s); cnt.appendChild(pl);
      bot.appendChild(cnt);
    }
    body.appendChild(top); body.appendChild(bot);
    card.appendChild(img); card.appendChild(body);
    grid.appendChild(card);
  });
  return grid;
}

function chg(id, d) {
  cart[id] = (cart[id] || 0) + d;
  if (cart[id] <= 0) delete cart[id];
  render();
  upCartUI();
}

function sendOrder() {
  let it = [], tot = 0;
  for (const id in cart) {
    const x = PRODS.find(p => p.id == id);
    if (x) { it.push(x.n + " x" + cart[id]); tot += x.p * cart[id]; }
  }
  if (tot <= 0) return;
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify({ items: it.join(", "), total: Number(tot.toFixed(2)) }));
  }
}

function upCartUI() {
  const topBar = document.getElementById("cartTopBar");
  const topTotal = document.getElementById("cartTopTotal");
  const topCount = document.getElementById("cartTopCount");
  const dock = document.getElementById("bottomDock");

  let tot = 0, qty = 0;
  for (const id in cart) {
    const x = PRODS.find(p => p.id == id);
    if (x) { tot += x.p * cart[id]; qty += cart[id]; }
  }

  if (tot > 0) {
    topBar.classList.add("show");
    topTotal.textContent = "🛒 Корзина: " + tot.toFixed(2) + " BYN";
    topCount.textContent = "Выбрано позиций: " + qty + " шт. (нажмите для проверки)";
    if (window.Telegram && window.Telegram.WebApp) {
      dock.style.paddingBottom = "64px";
      window.Telegram.WebApp.MainButton.setText("ОПЛАТИТЬ ЗАКАЗ • " + tot.toFixed(2) + " BYN");
      window.Telegram.WebApp.MainButton.show();
    }
  } else {
    topBar.classList.remove("show");
    if (window.Telegram && window.Telegram.WebApp) {
      dock.style.paddingBottom = "14px";
      window.Telegram.WebApp.MainButton.hide();
    }
  }
}

function openM(t) {
  const mt = document.getElementById("mt");
  const mx = document.getElementById("mx");
  const mm = document.getElementById("mm");
  const ma = document.getElementById("ma");
  mm.innerHTML = ""; ma.innerHTML = ""; mx.textContent = "";

  if (t === "cart") {
    mt.textContent = "🛒 Ваш заказ";
    let tot = 0;
    for (const id in cart) {
      const x = PRODS.find(p => p.id == id);
      if (x) {
        const sum = x.p * cart[id];
        tot += sum;
        const row = el("div", "cart-row");
        row.appendChild(el("span", "", x.n + " × " + cart[id]));
        row.appendChild(el("b", "", sum.toFixed(2) + " BYN"));
        mm.appendChild(row);
      }
    }
    mx.textContent = "\nИтого к оплате: " + tot.toFixed(2) + " BYN\n(Списать бонусные баллы можно на следующем шаге в чате)";
    const payBtn = el("button", "rb", "💳 Перейти к оплате • " + tot.toFixed(2) + " BYN");
    payBtn.onclick = sendOrder;
    ma.appendChild(payBtn);
  } else if (t === "geo") {
    mt.textContent = CONFIG.shopName;
    const wrap = el("div", "mf");
    const ifr = el("iframe");
    ifr.width = "100%"; ifr.height = "100%"; ifr.frameBorder = "0";
    ifr.src = "https://openstreetmap.org";
    wrap.appendChild(ifr);
    mm.appendChild(wrap);
    mx.textContent = CONFIG.address;
    const a = el("a", "rb", "🗺 Открыть в Яндекс.Картах");
    a.href = "https://yandex.by";
    a.target = "_blank";
    ma.appendChild(a);
  } else if (t === "bonus") {
    mt.textContent = "🎁 Программа лояльности";
    mx.textContent = "• Ваш баланс: " + CONFIG.bonus + " баллов\n• Курс: 100 баллов = 1 BYN\n• Кэшбэк с каждого заказа: 10%";
  } else {
    mt.textContent = "💬 Связь с бариста";
    mx.textContent = "Есть вопрос по заказу или меню? Напишите нам в Telegram: @" + CONFIG.barista;
  }
  document.getElementById("modalOverlay").classList.add("open");
}

function closeM() { document.getElementById("modalOverlay").classList.remove("open"); }

document.getElementById("btnGeo").onclick = function() { openM("geo"); };
document.getElementById("btnBonus").onclick = function() { openM("bonus"); };
document.getElementById("btnTopBonus").onclick = function() { openM("bonus"); };
document.getElementById("btnWrite").onclick = function() { openM("write"); };
document.getElementById("btnOpenCart").onclick = function() { openM("cart"); };
document.getElementById("btnTopPay").onclick = sendOrder;
document.getElementById("btnClose").onclick = closeM;
document.getElementById("modalOverlay").onclick = function(e) { if (e.target.id === "modalOverlay") closeM(); };
document.getElementById("searchInput").oninput = function(e) { searchQ = e.target.value; render(); };

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  tg.MainButton.onClick(sendOrder);
}

render();

