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
const f = $('#loc'), the = $$('.xe'), ds = $('.ds');
const bo = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
const chuoi = the.map(x => { const t = bo(x.dataset.tim); return t + ' ' + t.replace(/\s+/g, ''); });
const MAC = {}; $$('input[type=range]', f).forEach(i => MAC[i.name] = i.defaultValue);
function loc(ghi) {
const d = new FormData(f), dong = d.get('dong') || '', q = bo(d.get('q') || '').trim();
const tu = q.split(/\s+/).filter(Boolean), lien = q.replace(/\s+/g, '');
const nam = +d.get('nam') || 0, km = +d.get('km') || 0, gia = +d.get('gia') || 0, nl = d.get('nl') || '';
const maxKm = f.km ? +f.km.max : 0, maxGia = f.gia ? +f.gia.max : 0;
let n = 0;
the.forEach((x, i) => {
const s = x.dataset;
const ok = (!dong || s.dong === dong) && (!nl || s.nl === nl) && (!nam || +s.nam >= nam) && (!km || km >= maxKm || +s.km <= km) &&
(!gia || gia >= maxGia || (s.gia && +s.gia <= gia)) && (!q || chuoi[i].includes(lien) || tu.every(t => chuoi[i].includes(t)));
x.hidden = !ok; if (ok) n++;
});
$('#dem').textContent = n ? n + ' xe đang có' : 'Chưa có xe phù hợp';
$('.trong').hidden = n > 0;
if (f.km) $('#oKm').textContent = km >= maxKm ? 'Không giới hạn' : 'Tới ' + soVN(km) + ' km';
if (f.gia) $('#oGia').textContent = gia >= maxGia ? 'Không giới hạn' : 'Tới ' + trieu(gia);
const hop = [];
if (dong) hop.push(dong); if (q) hop.push('"' + d.get('q').trim() + '"'); if (nam) hop.push('đời ' + nam + ' trở lên');
if (km && km < maxKm) hop.push('dưới ' + soVN(km) + ' km'); if (gia && gia < maxGia) hop.push('dưới ' + trieu(gia)); if (nl) hop.push('xe ' + nl.toLowerCase());
$('#timGiup').dataset.zalo = 'Chào CAREO, anh/chị cần tìm xe' + (hop.length ? ': ' + hop.join(', ') : '') + '. Có xe về nhờ em báo giúp.';
const sl = hop.length - (dong ? 1 : 0) - (q ? 1 : 0);
$('#moLoc').textContent = sl ? 'Lọc (' + sl + ')' : 'Lọc';
if (ghi) {
const u = new URLSearchParams(location.search);
const dat = (k, v) => v ? u.set(k, v) : u.delete(k);
dat('dong', dong); dat('q', (d.get('q') || '').trim()); dat('nam', nam || ''); dat('nl', nl);
dat('km', km && km < maxKm ? km : ''); dat('gia', gia && gia < maxGia ? gia : '');
try { history.replaceState(null, '', location.pathname + (u + '' ? '?' + u : '') + location.hash); } catch (_) {}
}
}
function sap() {
const k = $('#sap').value, so = x => +x.dataset[k.slice(0, 3) === 'gia' ? 'gia' : k === 'nam' ? 'nam' : k === 'km' ? 'km' : 'tt'] || 0;
const dau = k === 'nam' || k === 'giaX' ? -1 : 1;
[...the].sort((a, b) => dau * (so(a) - so(b))).forEach(x => ds.append(x));
}
f.addEventListener('input', () => loc(true));
f.addEventListener('submit', e => { e.preventDefault(); $('#q').blur(); });
$('#sap').addEventListener('change', sap);
$('#moLoc').addEventListener('click', e => { const m = $('.loc').classList.toggle('mo'); e.target.setAttribute('aria-expanded', m); });
function xoa() { f.reset(); $$('input[type=range]', f).forEach(i => i.value = MAC[i.name]); $$('select', f).forEach(i => i.value = ''); $('#q').value = ''; const t = $('[name=dong][value=""]', f); if (t) t.checked = true; loc(true); }
$$('[data-xoa]').forEach(b => b.addEventListener('click', xoa));
{
const u = new URLSearchParams(location.search); let co = false;
for (const k of ['q', 'nam', 'km', 'gia', 'nl']) if (u.get(k) && f.elements[k]) { f.elements[k].value = u.get(k); co = true; }
const r = $$('[name=dong]', f).find(x => x.value.toLowerCase() === (u.get('dong') || '-').toLowerCase()); if (r) { r.checked = true; co = true; }
if (co) loc(false);
}
const thanh = $('.ssb');
function veSS() {
const ds = layXe();
$$('.ss input').forEach(i => { i.checked = ds.includes(i.value); });
thanh.hidden = !ds.length;
$('b', thanh).textContent = ds.length < 2 ? 'Chọn thêm 1 xe để so sánh' : 'Đã chọn ' + ds.length + ' xe';
const a = $('a', thanh); a.href = 'so-sanh.html?x=' + ds.join(','); a.hidden = ds.length < 2;
}
ds.addEventListener('change', e => {
if (!e.target.matches('.ss input')) return;
e.stopPropagation();
let c = layXe().filter(x => x !== e.target.value);
if (e.target.checked) { if (c.length >= 3) { e.target.checked = false; return bao('So sánh tối đa 3 xe. Anh/chị bỏ bớt 1 xe nhé.'); } c.push(e.target.value); }
ghiXe(c);
veSS();
});
$('button', thanh).addEventListener('click', () => { ghiXe([]); veSS(); });
addEventListener('pageshow', veSS);