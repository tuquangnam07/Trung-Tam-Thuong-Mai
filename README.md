# The Vault – Trung tâm thương mại trực tuyến

Website bán hàng tĩnh (HTML/CSS/JS) dùng Firebase Authentication và Firestore. Không cần build.

## Cấu trúc thư mục
```
the-vault/
├─ index.html        Trang giới thiệu
├─ san-pham.html     Xem sản phẩm, lọc theo gian hàng
├─ gio-hang.html     Giỏ hàng
├─ thanh-toan.html   Giao hàng và thanh toán (COD, chuyển khoản QR)
├─ don-hang.html     Lịch sử đơn, hủy đơn, mã QR chuyển khoản
├─ dang-ky.html      Đăng ký (đủ thông tin, kiểm tra từng ô)
├─ dang-nhap.html    Đăng nhập email, Google, quên mật khẩu
├─ css/style.css     Giao diện dùng chung
├─ js/firebase.js    Cấu hình Firebase, đăng ký, hồ sơ
├─ js/app.js         Danh mục sản phẩm, giỏ hàng, thanh đầu trang
└─ firestore.rules   Quy tắc bảo mật Firestore
```

## Cách chạy
Trang dùng ES module và Firebase Auth nên **không mở trực tiếp bằng cách bấm đúp file** (`file://` sẽ lỗi). Chọn một cách:
- Chạy thử trên máy: trong thư mục `the-vault`, gõ `npx serve` (hoặc dùng tiện ích Live Server của VS Code), rồi mở địa chỉ `http://localhost:...`.
- Đưa lên mạng: Cloudflare Pages → Upload assets → kéo cả thư mục `the-vault` vào.

## Thiết lập Firebase (làm một lần)
1. Authentication → Sign-in method: bật Email/Password và Google (bạn đã bật).
2. Authentication → Settings → Authorized domains: thêm `trung-tam-thuong-mai.pages.dev` (`localhost` đã có sẵn).
3. Firestore Database → Create database.
4. Firestore Database → Rules: dán toàn bộ nội dung `firestore.rules` rồi Publish.

## Thay thông tin thanh toán
Mở `js/app.js`, sửa `BANK` (mã ngân hàng BIN, số tài khoản, tên chủ tài khoản). Danh sách mã BIN: https://api.vietqr.io/v2/banks

## Lưu ý
- Giá sản phẩm nằm trong `js/app.js`. Đơn hàng lưu bản chụp tên và giá lúc đặt. Vì chưa có máy chủ kiểm tra lại giá, hãy đối chiếu đơn trước khi giao.
- Muốn cấp quyền admin: sửa trường `role` của tài khoản đó thành `admin` trong Firestore Console (collection `users`).
