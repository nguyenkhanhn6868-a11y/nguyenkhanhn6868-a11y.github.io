'use strict';
const $ = (s, g = document) => g.querySelector(s), $$ = (s, g = document) => [...g.querySelectorAll(s)];
const tam_ = {};
const nho = (kho, k, v) => { if (v !== undefined) tam_[k] = v; try { return v === undefined ? window[kho].getItem(k) : window[kho].setItem(k, v); } catch (_) { return v === undefined ? (tam_[k] || null) : null; } };
const SDT = document.body.dataset.sdt;
const ZALO = 'https://zalo.me/' + SDT;
const soVN = n => Math.round(n).toLocaleString('vi-VN');
const trieu = n => n >= 1000 ? (n / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ' : n.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' triệu';
const toiKhong = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches; };
$('.doi').addEventListener('click', () => { const t = toiKhong() ? 'light' : 'dark'; document.documentElement.dataset.theme = t; nho('localStorage', 'theme', t); });
let hen;
function bao(chu) {
let t = $('.tb');
if (!t) { t = document.createElement('div'); t.className = 'tb'; t.setAttribute('role', 'status'); document.body.append(t); }
t.textContent = chu; void t.offsetWidth; t.classList.add('hien');
clearTimeout(hen); hen = setTimeout(() => t.classList.remove('hien'), 4000);
}
function chep(chu) {
const o = document.createElement('textarea');
o.value = chu; o.readOnly = true; o.style.cssText = 'position:fixed;top:0;left:-9999px;font-size:16px';
document.body.append(o);
const cu = document.activeElement; o.select(); o.setSelectionRange(0, chu.length);
let ok = false; try { ok = document.execCommand('copy'); } catch (_) {}
o.remove(); if (cu && cu.focus) cu.focus({ preventScroll: true });
if (ok) return Promise.resolve(true);
try { return navigator.clipboard.writeText(chu).then(() => true, () => false); } catch (_) { return Promise.resolve(false); }
}
(() => {
const q = new URLSearchParams(location.search), r = document.referrer;
const n = q.get('utm_source') || (q.has('ttclid') || /tiktok/i.test(r) ? 'TikTok' : q.has('fbclid') || /facebook|fb\.com/i.test(r) ? 'Facebook' : /google\./i.test(r) ? 'Google' : /youtu/i.test(r) ? 'YouTube' : '');
if (n) nho('sessionStorage', 'nguon', n.replace(/[^\p{L}\p{N} _.-]/gu, '').slice(0, 24));
})();
const kemNguon = t => { const n = nho('sessionStorage', 'nguon'); return t + (n ? '\n(Xem xe từ ' + n + ')' : ''); };
function duPhong(tin) {
let d = $('.dp');
if (!d) {
d = document.createElement('div'); d.className = 'dp the'; d.setAttribute('role', 'status');
d.innerHTML = '<b>Không mở được Zalo?</b> Anh/chị gọi em hoặc chép số.<div><a class="nut vang" href="tel:' + SDT + '">Gọi em</a><button class="nut" data-so>Chép số</button><button class="nut" data-tin>Chép tin</button></div><button class="x" aria-label="Đóng">×</button>';
document.body.append(d);
d.addEventListener('click', e => {
if (e.target.closest('.x')) d.hidden = true;
else if (e.target.closest('[data-so]')) chep(SDT).then(k => bao(k ? 'Đã chép số ' + document.body.dataset.sdtChu : 'Số của em: ' + document.body.dataset.sdtChu));
else if (e.target.closest('[data-tin]')) chep(d.tin).then(k => bao(k ? 'Đã chép tin nhắn' : 'Máy không cho chép tin nhắn'));
});
}
d.tin = tin; d.hidden = false;
}
const chuot = matchMedia('(hover:hover) and (pointer:fine)').matches;
let dangCho = '';
document.addEventListener('click', e => {
const a = e.target.closest('a[data-zalo]'); if (!a) return;
const tin = kemNguon(a.dataset.zalo || 'Chào CAREO, anh/chị cần tư vấn xe.');
if (chuot) { a.target = '_blank'; a.rel = 'noopener'; }
chep(tin).then(k => bao(k ? 'Đã chép sẵn tin nhắn. Vào Zalo anh/chị chỉ cần dán.' : 'Anh/chị nhắn giúp em tên xe đang xem nhé.'));
if (!chuot) { dangCho = tin; setTimeout(() => { if (dangCho && document.visibilityState === 'visible') duPhong(dangCho); dangCho = ''; }, 3000); }
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') dangCho = ''; });
addEventListener('pagehide', () => { dangCho = ''; });
const layXe = () => (nho('localStorage', 'ss') || '').split(',').filter(Boolean).slice(0, 3);
const ghiXe = ds => nho('localStorage', 'ss', ds.join(','));
const t = $('#tg');
function lich(vay, thang, l1, n1, l2, deu) {
let no = vay; const kq = [];
for (let i = 1; i <= thang; i++) {
const r = (i <= n1 ? l1 : l2) / 1200, lai = no * r;
let goc;
if (!deu) goc = vay / thang;
else { const con = thang - i + 1; const pmt = r ? no * r / (1 - Math.pow(1 + r, -con)) : no / con; goc = pmt - lai; }
if (i === thang) goc = no;
no = Math.max(0, no - goc); kq.push({ goc, lai, tong: goc + lai });
}
return kq;
}
const kep = (v, a, b) => Math.min(b, Math.max(a, isFinite(v) ? v : a));
function tinh() {
const gia = kep(parseFloat(t.gia.value), 0, 10000), tt = +t.tt.value, thang = +t.thang.value;
const l1 = kep(parseFloat(t.l1.value), 0, 60), l2 = kep(parseFloat(t.l2.value), 0, 60), n1 = kep(parseInt(t.n1.value), 0, thang);
const truoc = gia * tt / 100, vay = gia - truoc, k = lich(vay, thang, l1, n1, l2, t.cach.value === 'deu');
$('#oTt').textContent = tt + '% = ' + trieu(truoc);
$('.loi').hidden = gia > 0; $('#ra').hidden = gia <= 0; if (gia <= 0) return;
const tongLai = k.reduce((s, x) => s + x.lai, 0), max = Math.max(...k.map(x => x.tong)), min = Math.min(...k.map(x => x.tong));
const tr = n => n.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' triệu';
$('#thang1').textContent = k[0].tong.toLocaleString('vi-VN', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
$('#kq').innerHTML = [['Trả trước', trieu(truoc)], ['Khoản vay', trieu(vay)], ['Tháng cao nhất', tr(max)], ['Tháng thấp nhất', tr(min)], n1 < thang && n1 > 0 ? ['Tháng ' + (n1 + 1) + ' (hết lãi đầu)', tr(k[n1].tong)] : 0, ['Tổng lãi', tr(tongLai)], ['Tổng trả ngân hàng', tr(vay + tongLai)]].filter(Boolean).map(([a, b]) => '<div><dt>' + a + '</dt><dd>' + b + '</dd></div>').join('');
const nam = []; k.forEach((x, i) => { const j = Math.floor(i / 12); (nam[j] = nam[j] || { g: 0, l: 0 }); nam[j].g += x.goc; nam[j].l += x.lai; });
const dinh = Math.max(...nam.map(n => n.g + n.l)) || 1;
$('.nam').innerHTML = nam.map((n, i) => '<div title="Năm ' + (i + 1) + ': gốc ' + tr(n.g) + ', lãi ' + tr(n.l) + '"><i style="height:' + (n.l / dinh * 88).toFixed(1) + 'px;background:var(--vang)"></i><i style="height:' + (n.g / dinh * 88).toFixed(1) + 'px;background:var(--chu);border-radius:0 0 6px 0"></i>N' + (i + 1) + '</div>').join('');
const xe = t.xe.selectedOptions[0];
$('#guiTg').dataset.zalo = 'Chào CAREO, anh/chị muốn hỏi trả góp' + (t.xe.value ? ' xe ' + xe.text : '') + '.\nGiá dự kiến: ' + trieu(gia) + '\nTrả trước: ' + tt + '% (' + trieu(truoc) + ')\nThời hạn: ' + thang + ' tháng\nNhờ em gửi giá xe và lãi suất ngân hàng thực tế.';
}
t.xe.addEventListener('change', () => { const g = t.xe.selectedOptions[0].dataset.gia; if (g) t.gia.value = g; tinh(); });
t.addEventListener('input', tinh); t.addEventListener('submit', e => e.preventDefault());
{ const x = new URLSearchParams(location.search).get('xe'); if (x && [...t.xe.options].some(o => o.value === x)) { t.xe.value = x; const g = t.xe.selectedOptions[0].dataset.gia; if (g) t.gia.value = g; } }
tinh();