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
const bang = $('table'), tatCa = $$('thead th[data-x]', bang).map(t => t.dataset.x);
const chonXe = $('#themXe');
let ds2 = (new URLSearchParams(location.search).get('x') || '').split(',').filter(x => tatCa.includes(x)).slice(0, 3);
if (!ds2.length) ds2 = layXe().filter(x => tatCa.includes(x));
function ve() {
ghiXe(ds2);
const coBang = ds2.length > 0;
$$('tr', bang).forEach(tr => {
const o = {}; $$('[data-x]', tr).forEach(c => { o[c.dataset.x] = c; c.hidden = !ds2.includes(c.dataset.x); });
ds2.forEach(x => tr.append(o[x]));
if (tr.parentNode.tagName === 'TBODY') {
const v = ds2.map(x => o[x].textContent.trim()), g = ds2.length > 1 && v.every(t => t === v[0]);
tr.classList.toggle('giong', g); tr.classList.toggle('khac', ds2.length > 1 && !g && !tr.hasAttribute('data-nut'));
}
});
bang.hidden = !coBang;
$('#chuaCo').hidden = ds2.length > 1;
$('#chuaCo b').textContent = ds2.length ? 'Chọn thêm một xe để so sánh' : 'Anh/chị chọn xe để so sánh';
chonXe.parentNode.hidden = ds2.length >= 3;
$$('option', chonXe).forEach(o => { o.hidden = o.disabled = ds2.includes(o.value); });
chonXe.value = '';
const ten = ds2.map(x => $('thead [data-x="' + x + '"] a', bang).textContent);
$('#hoiSS').dataset.zalo = 'Chào CAREO, anh/chị đang cân nhắc: ' + ten.join(' và ') + '. Nhờ em tư vấn giúp nên chọn xe nào và gửi giá từng xe.\n' + location.href.split('?')[0] + '?x=' + ds2.join(',');
$('#viec').hidden = $('#viec2').hidden = ds2.length < 2;
try { const u = new URLSearchParams(location.search); u.set('x', ds2.join(',')); history.replaceState(null, '', location.pathname + '?' + u.toString().replace(/%2C/g, ',')); } catch (_) {}
}
chonXe.addEventListener('change', () => { if (chonXe.value && ds2.length < 3) { ds2.push(chonXe.value); ve(); } });
bang.addEventListener('click', e => { const b = e.target.closest('[data-bo]'); if (b) { ds2 = ds2.filter(x => x !== b.dataset.bo); ve(); } });
$('#chiKhac').addEventListener('change', e => bang.classList.toggle('gon', e.target.checked));
$('#chiaSe').addEventListener('click', () => {
if (navigator.share) navigator.share({ title: 'So sánh xe CAREO', url: location.href }).catch(() => {});
else chep(location.href).then(k => bao(k ? 'Đã chép đường dẫn so sánh' : location.href));
});
ve();