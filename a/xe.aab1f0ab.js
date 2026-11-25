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
if (document.readyState === 'complete') document.body.classList.add('l'); else addEventListener('load', () => document.body.classList.add('l'));
const cuon = $('.cuon'), dem = $('.dem'), soAnh = $$('picture', cuon).length;
let doiDem;
cuon.addEventListener('scroll', () => { cancelAnimationFrame(doiDem); doiDem = requestAnimationFrame(() => { dem.textContent = (Math.round(cuon.scrollLeft / cuon.clientWidth) + 1) + '/' + soAnh; }); }, { passive: true });
$$('.mui').forEach(m => m.addEventListener('click', () => {
const k = Math.round(cuon.scrollLeft / cuon.clientWidth) + (m.classList.contains('s') ? 1 : -1);
cuon.scrollTo({ left: ((k + soAnh) % soAnh) * cuon.clientWidth, behavior: 'smooth' });
}));
$$('[data-video]').forEach(b => b.addEventListener('click', () => {
const i = document.createElement('iframe');
i.src = b.dataset.video; i.title = 'Video xe'; i.allow = 'autoplay; encrypted-media; fullscreen'; i.allowFullscreen = true;
b.replaceWith(i);
}));
const nutSS = $('#themSS');
const veNut = () => { nutSS.textContent = layXe().includes(nutSS.value) ? 'Đã thêm, mở so sánh' : 'Thêm vào so sánh'; };
nutSS.addEventListener('click', () => {
const c = layXe();
if (!c.includes(nutSS.value)) {
if (c.length >= 3) return bao('Đang có 3 xe để so sánh. Anh/chị bỏ bớt ở trang So sánh.');
c.push(nutSS.value); ghiXe(c);
if (c.length < 2) { veNut(); return bao('Đã thêm. Chọn thêm 1 xe nữa để so sánh.'); }
}
location.href = '../so-sanh.html?x=' + c.join(',');
});
addEventListener('pageshow', veNut);
$('#chiaSe').addEventListener('click', () => {
const u = location.href.split('?')[0];
if (navigator.share) navigator.share({ title: document.title, url: u }).catch(() => {});
else chep(u).then(k => bao(k ? 'Đã chép đường dẫn xe' : u));
});
const tam = $('#tam');
if (tam) {
const DEN = [['Vũng Tàu', 95, 1], ['Cần Thơ', 175, 1], ['Phan Thiết', 185, 1], ['Đà Lạt', 305, 1.3]];
const ve = () => {
const kwh = +tam.kwh.value, tt = +tam.tt.value, du = +tam.du.value;
const di = kwh > 0 ? kwh * (100 - du) / tt : 0, sau = kwh > 0 ? kwh * (80 - du) / tt : 0;
$('#oTt').textContent = tt.toLocaleString('vi-VN') + ' kWh/100 km'; $('#oDu').textContent = du + '%';
$('#kmDi').textContent = soVN(di);
$('.noi').innerHTML = DEN.map(([t, k, he]) => {
const s = di > 0 ? Math.max(0, Math.ceil((k - di / he) / (sau / he))) : 0;
return '<li><span><b>' + t + '</b><br><small>khoảng ' + k + ' km' + (he > 1 ? ', có đèo' : '') + '</small></span><span><i aria-hidden="true">' + (di > 0 ? '<u></u>'.repeat(Math.min(6, s + 1)) : '') + '</i><small>' + (di <= 0 ? 'Nhập dung lượng pin' : s ? 'Ghé sạc ít nhất ' + s + ' lần' : 'Ước tính tới nơi không cần ghé sạc') + '</small></span></li>';
}).join('');
const km = +tam.kmt.value, dien = km * tt / 100 * +tam.gd.value, xang = km * +tam.lx.value / 100 * +tam.gx.value;
$('#cpD').textContent = soVN(dien) + ' đ'; $('#cpX').textContent = soVN(xang) + ' đ';
$('#cpL').textContent = (xang >= dien ? 'Nhẹ hơn ' : 'Cao hơn ') + soVN(Math.abs(xang - dien)) + ' đ mỗi tháng';
};
tam.addEventListener('input', ve); tam.addEventListener('submit', e => e.preventDefault()); ve();
}