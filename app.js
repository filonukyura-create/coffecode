const urlParams = new URLSearchParams(window.location.search);
const userBonus = Number(urlParams.get("balance")) || 100;

const CONFIG = {
  shopName: "Кофейня «Зерно»",
  address: "📍 г. Минск, ул. Ломоносова, 6\n🕒 Время работы: ежедневно с 07:00 до 19:00",
  lat: 53.9261,
  lon: 27.5936,
  barista: "zerno_barista",
  bonus: userBonus
};

const CATS = [
  { id: "coffee", t: "Кофе", s: "Классика и авторский", e: "☕", bg: "linear-gradient(135deg,#6f4e37,#3e2723)" },
  { id: "combo", t: "Комбо", s: "Выгодные наборы", e: "🥐", bg: "linear-gradient(135deg,#d97706,#92400e)" },
  { id: "iced", t: "Напитки", s: "Айс-кофе и лимонады", e: "🧊", bg: "linear-gradient(135deg,#0284c7,#1e3a8a)" },
  { id: "food", t: "Еда", s: "Сэндвичи и десерты", e: "🥪", bg: "linear-gradient(135deg,#059669,#064e3b)" }
];

const PRODS = [
  { id: 1, c: "coffee", n: "Капучино (350 мл)", d: "100% арабика и плотная пенка", p: 6.00, e: "☕", bg: "linear-gradient(135deg,#78350f,#451a03)" },
  { id: 2, c: "coffee", n: "Флэт Уайт (250 мл)", d: "Двойной эспрессо с микропеной", p: 6.50, e: "🥛", bg: "linear-gradient(135deg,#5c4033,#2b1b17)" },
  { id: 3, c: "combo", n: "Круассан + Капучино", d: "Хрустящий круассан и капучино", p: 9.50, e: "🥐", bg: "linear-gradient(135deg,#ea580c,#7c2d12)" },
  { id: 4, c: "combo", n: "Сырники + Американо", d: "Тёплые сырники со сметаной", p: 11.00, e: "🥞", bg: "linear-gradient(135deg,#d97706,#78350f)" },
  { id: 5, c: "iced", n: "Айс Латте Карамель", d: "Охлаждённый кофе с карамелью", p: 7.00, e: "🧋", bg: "linear-gradient(135deg,#0ea5e9,#0369a1)" },
  { id: 6, c: "iced", n: "Эспрессо-тоник", d: "Эспрессо со швепсом и лаймом", p: 7.50, e: "🍋", bg: "linear-gradient(135deg,#10b981,#047857)" },
  { id: 7, c: "food", n: "Сэндвич с индейкой", d: "Чиабатта, индейка, творожный сыр", p: 8.50, e: "🥪", bg: "linear-gradient(135deg,#16a34a,#14532d)" },
  { id: 8, c: "food", n: "Чизкейк Нью-Йорк", d: "Классический сливочный десерт", p: 7.50, e: "🍰", bg: "linear-gradient(135deg,#db2777,#831843)" }
];

let cart = {}, activeCat = null, searchQ = "", useBonus = false;

const topBadge = document.querySelector(".bb");
if (topBadge) topBadge.textContent = "🎁 " + CONFIG.bonus + " баллов";

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

function makeArtBox(bg, emoji, height, radius) {
  const d = el("div", "", emoji);
  d.style.cssText = "background:" + bg + ";height:" + height + ";border-radius:" + radius + ";display:flex;align-items:center;justify-content:center;font-size:44px;width:100%;margin-top:auto;";
  return d;
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
    sub.style.cssText = "font-size:12px;color:var(--hint);margin-bottom:8px";
    info.appendChild(sub);
    card.appendChild(info);
    card.appendChild(makeArtBox(c.bg, c.e, "65%", "12px"));
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
    card.appendChild(makeArtBox(p.bg, p.e, "105px", "0"));
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
    card.appendChild(body);
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

function getTotals() {
  let rawTotal = 0, qty = 0;
  for (const id in cart) {
    const x = PRODS.find(p => p.id == id);
    if (x) { rawTotal += x.p * cart[id]; qty += cart[id]; }
  }
  const maxDiscount = Number((CONFIG.bonus / 100).toFixed(2));
  const discount = (useBonus && CONFIG.bonus > 0) ? Math.min(rawTotal, maxDiscount) : 0;
  const finalTotal = Number(Math.max(0, rawTotal - discount).toFixed(2));
  const spentPoints = useBonus ? Math.round(discount * 100) : 0;
  return { rawTotal, finalTotal, discount, spentPoints, qty };
}

function sendOrder() {
  let it = [];
  for (const id in cart) {
    const x = PRODS.find(p => p.id == id);
    if (x) it.push(x.n + " x" + cart[id]);
  }
  const t = getTotals();
  if (t.qty <= 0) return;
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.sendData(JSON.stringify({
      items: it.join(", "),
      total: t.finalTotal,
      spent: t.spentPoints
    }));
  }
}

function upCartUI() {
  const topBar = document.getElementById("cartTopBar");
  const topTotal = document.getElementById("cartTopTotal");
  const topCount = document.getElementById("cartTopCount");
  const dock = document.getElementById("bottomDock");
  const t = getTotals();

  if (t.qty > 0) {
    topBar.classList.add("show");
    topTotal.textContent = "🛒 Корзина: " + t.finalTotal.toFixed(2) + " BYN";
    topCount.textContent = "Позиций: " + t.qty + " шт. (нажмите для оформления)";
    if (window.Telegram && window.Telegram.WebApp) {
      dock.style.paddingBottom = "64px";
      window.Telegram.WebApp.MainButton.setText("ОФОРМИТЬ ЗАКАЗ • " + t.finalTotal.toFixed(2) + " BYN");
      window.Telegram.WebApp.MainButton.show();
    }
  } else {
    useBonus = false;
    topBar.classList.remove("show");
    if (window.Telegram && window.Telegram.WebApp) {
      dock.style.paddingBottom = "14px";
      window.Telegram.WebApp.MainButton.hide();
    }
  }
}

function openM(t) {
  const mt = document.getElementById("mt"), mx = document.getElementById("mx"), mm = document.getElementById("mm"), ma = document.getElementById("ma");
  mm.innerHTML = ""; ma.innerHTML = ""; mx.textContent = "";

  if (t === "cart") {
    const tot = getTotals();
    if (tot.qty <= 0) return;
    mt.textContent = "🛒 Оформление заказа";

    for (const id in cart) {
      const x = PRODS.find(p => p.id == id);
      if (x) {
        const row = el("div", "cart-row");
        row.appendChild(el("span", "", x.n + " × " + cart[id]));
        row.appendChild(el("b", "", (x.p * cart[id]).toFixed(2) + " BYN"));
        mm.appendChild(row);
      }
    }

    if (CONFIG.bonus > 0) {
      const maxDisc = Number((CONFIG.bonus / 100).toFixed(2));
      const box = el("label", "");
      box.style.cssText = "display:flex;align-items:center;justify-content:space-between;background:var(--sec);padding:12px;border-radius:12px;margin-top:12px;cursor:pointer;border:1px solid var(--brd)";
      const left = el("div");
      const title = el("b", "", "🎁 Списать " + CONFIG.bonus + " баллов?");
      title.style.fontSize = "14px";
      const sub = el("div", "", "Скидка −" + maxDisc.toFixed(2) + " BYN на этот заказ");
      sub.style.cssText = "font-size:12px;color:var(--hint)";
      left.appendChild(title); left.appendChild(sub);

      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = useBonus;
      chk.style.cssText = "width:20px;height:20px;accent-color:var(--btn)";
      chk.onchange = function() {
        useBonus = chk.checked;
        upCartUI();
        openM("cart");
      };

      box.appendChild(left);
      box.appendChild(chk);
      mm.appendChild(box);
    }

    mx.textContent = "\nИтого к оплате: " + tot.finalTotal.toFixed(2) + " BYN";
    const payBtn = el("button", "rb", "💳 Перейти к оплате • " + tot.finalTotal.toFixed(2) + " BYN");
    payBtn.onclick = sendOrder;
    ma.appendChild(payBtn);
  } else if (t === "geo") {
    mt.textContent = CONFIG.shopName;
    const wrap = el("div", "mf");
    const ifr = el("iframe");
    ifr.width = "100%"; ifr.height = "100%"; ifr.frameBorder = "0";
    ifr.src = "https://openstreetmap.org";
    wrap.appendChild(ifr); mm.appendChild(wrap);
    mx.textContent = CONFIG.address;
    const a = el("a", "rb", "🗺 Открыть в Яндекс.Картах");
    a.href = "https://yandex.by";
    a.target = "_blank"; ma.appendChild(a);
  } else if (t === "bonus") {
    mt.textContent = "🎁 Программа лояльности";
    mx.textContent = "• Ваш баланс: " + CONFIG.bonus + " баллов\n• Курс: 100 баллов = 1 BYN\n• Кэшбэк с каждого заказа: 10%";
  } else {
    mt.textContent = "💬 Связь с бариста";
    mx.textContent = "Напишите нам в Telegram: @" + CONFIG.barista;
  }
  document.getElementById("modalOverlay").classList.add("open");
}

function closeM() { document.getElementById("modalOverlay").classList.remove("open"); }
document.getElementById("btnGeo").onclick = () => openM("geo");
document.getElementById("btnBonus").onclick = () => openM("bonus");
document.getElementById("btnTopBonus").onclick = () => openM("bonus");
document.getElementById("btnWrite").onclick = () => openM("write");
document.getElementById("btnOpenCart").onclick = () => openM("cart");
document.getElementById("btnTopPay").onclick = () => openM("cart");
document.getElementById("btnClose").onclick = closeM;
document.getElementById("modalOverlay").onclick = (e) => { if (e.target.id === "modalOverlay") closeM(); };
document.getElementById("searchInput").oninput = (e) => { searchQ = e.target.value; render(); };

if (window.Telegram && window.Telegram.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready(); tg.expand();
  tg.MainButton.onClick(() => openM("cart"));
}
render();
