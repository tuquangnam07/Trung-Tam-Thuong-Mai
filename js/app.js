import {auth,onAuthStateChanged,signOut} from './firebase.js';

export const $=s=>document.querySelector(s);
export const money=n=>Number(n||0).toLocaleString('vi-VN')+'đ';
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Thông tin nhận chuyển khoản (mã QR VietQR). Thay bằng tài khoản thật của bạn.
export const BANK={bin:'970422',acc:'0888385536',name:'TU QUANG NAM'};

// Danh mục sản phẩm (id cố định để giỏ hàng và đơn hàng luôn khớp)
const S=(id,name,icon,color,L)=>({id,name,icon,color,products:L.map(([n,p,i,d],k)=>({id:id+'-'+(k+1),name:n,price:p,icon:i,desc:d}))});
export const CATS=[
 S('c1','Đồng hồ & Trang sức','⌚','#c9a24b',[['Chrono X1',24500000,'⌚','Đồng hồ cơ vỏ vàng, dây da thủ công'],['Nhẫn Kim Cương',38000000,'💍','Kim cương tự nhiên 1 carat'],['Vòng Ngọc',9800000,'📿','Ngọc bích chế tác thủ công']]),
 S('c2','Thời trang','👜','#b5486a',[['Aero Steppers',1200000,'👟','Giày thể thao phiên bản giới hạn'],['Lumière Tote',4600000,'👜','Túi da bê cao cấp'],['Áo Khoác Da',6900000,'🧥','Da thật, lót lụa'],['Mũ Dạ',890000,'🎩','Dáng cổ điển']]),
 S('c3','Công nghệ','🎧','#3a86c8',[['Sonic Pro',8500000,'🎧','Tai nghe chống ồn chủ động'],['Phone X',21900000,'📱','Màn hình OLED 120Hz'],['Laptop Air',32000000,'💻','Mỏng nhẹ, pin 20 giờ'],['Camera Pro',15500000,'📷','Cảm biến full-frame']]),
 S('c4','Nước hoa & Làm đẹp','🧴','#7a4fb5',[['Essence No.5',3200000,'🧴','Hương hoa cỏ tinh tế'],['Son Lụa',650000,'💄','Lì mịn, lâu trôi'],['Gương Pha Lê',1800000,'🪞','Viền pha lê chạm khắc'],['Bim Bim',2000,'🪞','Vcl']])
];
export const find=id=>{for(const c of CATS){const p=c.products.find(x=>x.id===id);if(p)return {...p,color:c.color,cat:c.name}}};

// Giỏ hàng lưu trong localStorage: {idSảnPhẩm: số lượng}
const K='vault_cart';
const rd=()=>{try{return JSON.parse(localStorage.getItem(K))||{}}catch{return {}}};
export const cart={
 items:()=>Object.entries(rd()).map(([id,qty])=>({p:find(id),qty})).filter(x=>x.p),
 count:()=>Object.values(rd()).reduce((a,b)=>a+b,0),
 add(id,n=1){const c=rd();c[id]=Math.min(99,(c[id]||0)+n);this.save(c)},
 set(id,q){const c=rd();q>0?c[id]=Math.min(99,q):delete c[id];this.save(c)},
 clear(){this.save({})},
 save(c){try{localStorage.setItem(K,JSON.stringify(c))}catch{}dispatchEvent(new Event('cart'))}
};

// Đăng nhập
export const authReady=()=>new Promise(r=>{const off=onAuthStateChanged(auth,u=>{off();r(u)})});
export async function need(){ // bắt buộc đăng nhập, xong quay lại đúng trang này
  const u=await authReady();
  if(!u){location.replace('dang-nhap.html?next='+(location.pathname.split('/').pop()||'index.html'));await new Promise(()=>{})}
  return u;
}

// Thanh đầu trang + chân trang dùng chung
export function header(){
  document.body.insertAdjacentHTML('afterbegin',`<header id="hd"><div class="wrap hdr"><a class="brand" href="index.html">THE VAULT</a>
   <nav><a href="san-pham.html">Sản phẩm</a><a href="don-hang.html">Đơn hàng</a></nav><div class="usr" id="usr"></div>
   <a class="cartb" href="gio-hang.html" aria-label="Giỏ hàng">🛒 <span id="cc">0</span></a></div></header>`);
  document.body.insertAdjacentHTML('beforeend','<footer class="ftr">© 2026 The Vault Mall. Hotline 1900 0000, mở cửa 9:00 – 22:00 mỗi ngày.</footer>');
  const upd=()=>$('#cc').textContent=cart.count();upd();addEventListener('cart',upd);
  onAuthStateChanged(auth,u=>{
    $('#usr').innerHTML=u?`<span>Xin chào, <b>${esc((u.displayName||u.email).trim().split(' ').pop())}</b></span><button class="lnk" id="lo">Đăng xuất</button>`
      :'<a href="dang-nhap.html">Đăng nhập</a><a class="pill" href="dang-ky.html">Đăng ký</a>';
    const b=$('#lo');if(b)b.onclick=async()=>{await signOut(auth);location.href='index.html'};
  });
}
