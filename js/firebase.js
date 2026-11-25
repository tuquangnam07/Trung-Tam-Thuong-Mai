// Cấu hình Firebase dùng chung cho mọi trang (ES module, không cần bundler)
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getAuth,onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signInWithPopup,GoogleAuthProvider,updateProfile,sendEmailVerification,sendPasswordResetEmail,signOut} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {getFirestore,doc,getDoc,runTransaction,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app=initializeApp({
  apiKey:"AIzaSyBgIVvySBu46JtZBBD20nXEPlNMwTuMG5c",
  authDomain:"trung-tam-thuong-mai.firebaseapp.com",
  projectId:"trung-tam-thuong-mai",
  storageBucket:"trung-tam-thuong-mai.firebasestorage.app",
  messagingSenderId:"222364218420",
  appId:"1:222364218420:web:27a10a3655c1b323c44661"
});
export const auth=getAuth(app), db=getFirestore(app);
export {onAuthStateChanged,signInWithEmailAndPassword,sendPasswordResetEmail,signOut};

export const HOME='san-pham.html';
export const nextUrl=()=>{const n=new URLSearchParams(location.search).get('next')||'';return /^[\w-]+\.html$/.test(n)?n:HOME};

const ERR={
 'auth/email-already-in-use':'Email này đã được đăng ký. Hãy đăng nhập.',
 'auth/invalid-email':'Email không hợp lệ.',
 'auth/weak-password':'Mật khẩu quá yếu. Hãy dùng ít nhất 8 ký tự, gồm chữ và số.',
 'auth/invalid-credential':'Email hoặc mật khẩu không đúng.',
 'auth/user-not-found':'Email hoặc mật khẩu không đúng.',
 'auth/wrong-password':'Email hoặc mật khẩu không đúng.',
 'auth/too-many-requests':'Bạn đã thử quá nhiều lần. Hãy đợi một lúc rồi thử lại.',
 'auth/popup-closed-by-user':'Bạn đã đóng cửa sổ đăng nhập Google.',
 'auth/popup-blocked':'Trình duyệt đã chặn cửa sổ Google. Hãy cho phép cửa sổ bật lên rồi thử lại.',
 'auth/network-request-failed':'Không có kết nối mạng. Hãy kiểm tra và thử lại.',
 'auth/unauthorized-domain':'Tên miền này chưa được thêm vào Authorized domains trong Firebase.',
 'app/username-taken':'Tên đăng nhập đã được dùng. Hãy chọn tên khác.',
 'permission-denied':'Chưa có quyền ghi dữ liệu. Hãy kiểm tra Firestore Rules.'
};
export const viError=e=>ERR[e&&e.code]||'Có lỗi xảy ra. Vui lòng thử lại.';

export const usernameFree=async u=>!(await getDoc(doc(db,'usernames',u))).exists();
export const hasProfile=async uid=>(await getDoc(doc(db,'users',uid))).exists();

// Lưu hồ sơ + giữ chỗ tên đăng nhập trong cùng một giao dịch (tránh trùng tên)
export async function saveProfile(user,d){
  const u=d.username.toLowerCase();
  await runTransaction(db,async tx=>{
    const ref=doc(db,'usernames',u);
    if((await tx.get(ref)).exists())throw {code:'app/username-taken'};
    tx.set(ref,{uid:user.uid});
    tx.set(doc(db,'users',user.uid),{fullName:d.fullName,username:u,email:user.email,phone:d.phone,role:'customer',createdAt:serverTimestamp()});
  });
  await updateProfile(user,{displayName:d.fullName}).catch(()=>{});
}
export async function registerUser(d){
  if(!(await usernameFree(d.username.toLowerCase())))throw {code:'app/username-taken'};
  const {user}=await createUserWithEmailAndPassword(auth,d.email,d.password);
  try{await saveProfile(user,d)}catch(e){await user.delete().catch(()=>{});throw e}
  sendEmailVerification(user).catch(()=>{});
  return user;
}
export async function googleSignIn(){
  const {user}=await signInWithPopup(auth,new GoogleAuthProvider());
  return {user,profile:await hasProfile(user.uid)};
}

// Các hàm Firestore dùng ở trang giỏ hàng, thanh toán, đơn hàng
export {collection,getDocs,setDoc,updateDoc,query,where,doc,getDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
