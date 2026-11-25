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
const m = $('#tm'), O = ['nhu', 'dong', 'ban', 'nam', 'km', 'pin', 'noi', 'ghi'];
const gt = k => { const e = m.elements[k]; return (e && e.value || '').trim(); };
const laXang = () => /xăng|fadil|lux|president/i.test(gt('dong'));
function tin() {
const km = gt('km').replace(/\D/g, '');
return ['Chào CAREO, anh/chị muốn ' + gt('nhu').toLowerCase() + '.', 'Xe: ' + gt('dong') + (gt('ban') ? ' ' + gt('ban') : ''), 'Đời: ' + (gt('nam') || '(chưa ghi)'), 'Số km: ' + (km ? soVN(+km) + ' km' : '(chưa ghi)'),
!laXang() && gt('pin') ? 'Pin: ' + gt('pin') : '', gt('noi') ? 'Xe ở: ' + gt('noi') : '', gt('ghi') ? 'Tình trạng: ' + gt('ghi') : '', 'Nhờ em báo giá thu giúp. Anh/chị gửi ảnh xe ở tin sau.'].filter(Boolean).join('\n');
}
function ve() {
$('#oPin').hidden = laXang();
const s = tin(); $('.tin').textContent = s; $('#guiTm').dataset.zalo = s;
try { sessionStorage.setItem('tm', JSON.stringify(O.map(gt))); } catch (_) {}
}
try { const c = JSON.parse(sessionStorage.getItem('tm') || 'null'); if (c) O.forEach((k, i) => { if (c[i] && m.elements[k]) m.elements[k].value = c[i]; }); } catch (_) {}
m.addEventListener('input', ve);
function thieu() {
const nam = +gt('nam'), nay = new Date().getFullYear() + 1, km = gt('km').replace(/\D/g, '');
if (!gt('dong')) return ['dong', 'Anh/chị chọn dòng xe giúp em.'];
if (!nam || nam < 1990 || nam > nay) return ['nam', 'Anh/chị điền đời xe, ví dụ 2023.'];
if (!km) return ['km', 'Anh/chị điền số km đã chạy, gần đúng cũng được.'];
return null;
}
m.addEventListener('submit', e => {
e.preventDefault();
const t = thieu(), l = $('.loi');
if (t) { l.textContent = t[1]; l.hidden = false; m.elements[t[0]].focus(); return; }
l.hidden = true; ve(); $('#xem').hidden = false; $('#xem').scrollIntoView({ block: 'start', behavior: 'smooth' }); $('#xem h2').focus({ preventScroll: true });
});
$('#chepTm').addEventListener('click', () => chep(kemNguon(tin())).then(k => bao(k ? 'Đã chép nội dung' : 'Máy không cho chép. Anh/chị giữ vào chữ để chép.')));
const nutCS = $('#csTm');
if (navigator.share) { nutCS.hidden = false; nutCS.addEventListener('click', () => navigator.share({ text: kemNguon(tin()) }).catch(() => {})); }
m.km.addEventListener('blur', () => { const n = gt('km').replace(/\D/g, ''); if (n) m.km.value = soVN(+n); ve(); });
ve();