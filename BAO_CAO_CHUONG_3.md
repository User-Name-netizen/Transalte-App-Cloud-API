# CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 3.1. Yêu cầu chức năng

Hệ thống ứng dụng dịch văn bản đa ngôn ngữ được thiết kế để đáp ứng các nhu cầu cụ thể của người dùng trong việc dịch thuật văn bản nhanh chóng và chính xác. Các yêu cầu chức năng được phân tích và định nghĩa dựa trên nghiên cứu hành vi người dùng và các thực hành tốt nhất trong lĩnh vực ứng dụng dịch thuật.

**Chức năng dịch văn bản cơ bản** là tính năng cốt lõi của hệ thống, cho phép người dùng nhập văn bản trong một ngôn ngữ và nhận được bản dịch trong ngôn ngữ đích. Hệ thống hỗ trợ 10 ngôn ngữ phổ biến nhất thế giới bao gồm Tiếng Việt, Tiếng Anh, Tiếng Pháp, Tiếng Tây Ban Nha, Tiếng Đức, Tiếng Nhật, Tiếng Hàn, Tiếng Trung, Tiếng Thái và Tiếng Indonesia. Văn bản đầu vào có thể có độ dài tối đa 5000 ký tự để đảm bảo hiệu suất và thời gian phản hồi tối ưu.

**Tính năng tự động nhận diện ngôn ngữ nguồn** được tích hợp để tự động nhận diện ngôn ngữ của văn bản đầu vào mà không cần người dùng chỉ định thủ công. Khi người dùng chọn "Tự động nhận diện" trong menu chọn ngôn ngữ nguồn, hệ thống sẽ sử dụng Google Cloud Translation API để phân tích văn bản và xác định ngôn ngữ với độ tin cậy cao. Kết quả nhận diện sẽ được hiển thị trong phần thông tin dịch thuật để người dùng xác nhận.

**Chức năng hoán đổi ngôn ngữ** cho phép người dùng nhanh chóng đảo ngược cặp ngôn ngữ dịch với một cú nhấp chuột. Tính năng này đặc biệt hữu ích khi người dùng muốn dịch ngược lại để kiểm tra độ chính xác của bản dịch hoặc khi làm việc với hai ngôn ngữ cụ thể trong một phiên làm việc dài.
**Đếm ký tự theo thời gian thực** được triển khai để hiển thị số ký tự hiện tại trong cả vùng nhập liệu và vùng kết quả. Hệ thống sẽ cảnh báo người dùng khi đạt gần giới hạn (90% = cảnh báo, 100% = nguy hiểm) thông qua các chỉ báo màu sắc. Điều này giúp người dùng quản lý độ dài nội dung và tránh việc cắt bớt không mong muốn.

**Chức năng chuyển văn bản thành giọng nói** tích hợp Web Speech API để phát âm kết quả dịch, giúp người dùng học cách phát âm chính xác từ và câu trong ngôn ngữ đích. Tính năng này hỗ trợ lựa chọn giọng nói dựa trên ngôn ngữ đích và có thể điều chỉnh tốc độ và cao độ giọng nói.

**Chức năng sao chép vào bộ nhớ đệm** cho phép người dùng sao chép kết quả dịch vào bộ nhớ đệm với một cú nhấp chuột. Hệ thống sử dụng Clipboard API hiện đại với phương án dự phòng cho các trình duyệt cũ hơn, đồng thời hiển thị thông báo xác nhận khi sao chép thành công.

**Nhận diện ngôn ngữ theo yêu cầu** cung cấp nút riêng để phát hiện ngôn ngữ của văn bản hiện tại, kèm theo mức độ tin cậy. Tính năng này hữu ích khi người dùng muốn xác nhận ngôn ngữ trước khi dịch hoặc khi làm việc với nội dung đa ngôn ngữ.

**Chức năng xóa nội dung nhập** cho phép người dùng xóa nhanh nội dung vùng nhập liệu và đặt lại biểu mẫu về trạng thái ban đầu. Hành động này cũng xóa vùng kết quả và đặt lại bộ đếm ký tự.

**Hệ thống trạng thái và thông báo lỗi** cung cấp phản hồi thời gian thực cho tất cả các hành động của người dùng. Thông báo thành công, thông báo lỗi và chỉ báo tiến trình được hiển thị với định dạng phù hợp và tự động ẩn sau khoảng thời gian nhất định.

## 3.2. Yêu cầu phi chức năng

Yêu cầu phi chức năng định nghĩa các tiêu chí chất lượng và ràng buộc mà hệ thống phải đáp ứng để đảm bảo trải nghiệm người dùng tối ưu và độ tin cậy hoạt động. Những yêu cầu này đóng vai trò quan trọng trong việc đánh giá tiêu chí thành công của dự án.

**Yêu cầu về hiệu suất** được thiết lập với mục tiêu đảm bảo thời gian phản hồi chấp nhận được cho trải nghiệm người dùng tốt. Yêu cầu dịch thuật phải được xử lý và trả về kết quả trong vòng 3 giây cho văn bản có độ dài trung bình (dưới 1000 ký tự). Các thao tác nhận diện ngôn ngữ phải hoàn thành trong vòng 1 giây. Thời gian tải trang không được vượt quá 2 giây trên kết nối internet tốc độ trung bình. Hệ thống phải có khả năng xử lý ít nhất 100 người dùng đồng thời mà không suy giảm đáng kể về hiệu suất.

**Yêu cầu về khả năng sử dụng** tập trung vào việc tạo ra giao diện trực quan và dễ tiếp cận cho các nhóm người dùng đa dạng. Giao diện phải đáp ứng và hoạt động tốt trên các thiết bị có kích thước màn hình từ 320px đến 1920px. Điều hướng và luồng người dùng phải đơn giản, cho phép hoàn thành tác vụ dịch thuật trong tối đa 3 cú nhấp chuột. Thông báo lỗi phải rõ ràng và có thể thực hiện được, giúp người dùng hiểu và giải quyết vấn đề. Tính năng tiếp cận phải tuân thủ hướng dẫn WCAG 2.1 AA với HTML ngữ nghĩa phù hợp, nhãn ARIA và hỗ trợ điều hướng bằng bàn phím.

**Yêu cầu về độ tin cậy** đảm bảo hệ thống hoạt động ổn định và có thể dự đoán. Thời gian hoạt động hệ thống phải đạt ít nhất 99% trong điều kiện bình thường. Xử lý lỗi phải nhẹ nhàng với các cơ chế dự phòng khi các cuộc gọi API thất bại. Xác thực dữ liệu phải toàn diện để ngăn chặn các yêu cầu sai định dạng đến các dịch vụ backend. Hệ thống phải tự động phục hồi từ các vấn đề mạng tạm thời và hạn chế API.
**Yêu cầu về bảo mật** bảo vệ dữ liệu người dùng và tính toàn vẹn hệ thống. Tất cả giao tiếp API phải sử dụng mã hóa HTTPS. Xác thực đầu vào phải ngăn chặn các cuộc tấn công XSS và injection. Khóa API và cấu hình nhạy cảm phải được lưu trữ an toàn trong biến môi trường. Giới hạn tần suất phải được triển khai để ngăn chặn lạm dụng và bảo vệ chống lại các cuộc tấn công từ chối dịch vụ. Dữ liệu đầu vào của người dùng không được ghi nhật ký hoặc lưu trữ vĩnh viễn.

**Yêu cầu về khả năng mở rộng** đảm bảo hệ thống có thể phát triển theo nhu cầu. Kiến trúc backend phải hỗ trợ mở rộng theo chiều ngang thông qua cân bằng tải. Thiết kế cơ sở dữ liệu (nếu có) phải được tối ưu hóa cho khối lượng công việc đọc nhiều. Các chiến lược bộ nhớ đệm phải được triển khai ở nhiều lớp để giảm tần suất gọi API. Tích hợp CDN phải có sẵn cho việc phân phối tài sản tĩnh.

**Yêu cầu về tương thích** đảm bảo hỗ trợ thiết bị và trình duyệt rộng rãi. Frontend phải tương thích với các trình duyệt hiện đại: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. Trình duyệt di động trên iOS Safari và Android Chrome phải được hỗ trợ. Các tính năng ứng dụng web tiến bộ có thể được xem xét cho chức năng ngoại tuyến. Các điểm cuối API phải RESTful và được kiểm soát phiên bản để duy trì khả năng tương thích ngược.

**Yêu cầu về khả năng bảo trì** tạo điều kiện cho việc phát triển và hỗ trợ dài hạn. Mã phải tuân theo các hướng dẫn phong cách đã được thiết lập và các thực hành tốt nhất. Tài liệu phải toàn diện và cập nhật. Ghi nhật ký và giám sát phải đầy đủ cho việc gỡ lỗi và phân tích hiệu suất. Quy trình triển khai phải được tự động hóa và có thể lặp lại. Theo dõi lỗi và phân tích phải được tích hợp để tạo điều kiện cải tiến liên tục.

## 3.3. Biểu đồ ca sử dụng (Use Case Diagram)

## 3.4. Sơ đồ kiến trúc hệ thống

## 3.5. Luồng xử lý dữ liệu (Flowchart)

## 3.6. Thiết kế giao diện người dùng

Thiết kế giao diện người dùng của ứng dụng dịch thuật được xây dựng theo nguyên tắc thiết kế tối giản với mục tiêu tạo ra trải nghiệm người dùng trực quan, hiệu quả và dễ tiếp cận. Giao diện được thiết kế đáp ứng để hoạt động tối ưu trên mọi thiết bị từ điện thoại thông minh đến máy tính để bàn, đảm bảo tính nhất quán trong trải nghiệm người dùng trên các nền tảng khác nhau.
**Cấu trúc bố cục và phân cấp hình ảnh**

Cấu trúc bố cục được tổ chức theo logic luồng dọc, bắt đầu từ tiêu đề thương hiệu, sau đó là các điều khiển lựa chọn ngôn ngữ, khu vực dịch thuật chính, và cuối cùng là thông tin chân trang. Phần tiêu đề chứa tiêu đề ứng dụng với biểu tượng ngôn ngữ để tạo nhận diện thương hiệu và vẻ ngoài chuyên nghiệp. Sử dụng phân cấp kiểu chữ với H1 cho tiêu đề chính, phụ đề cho mô tả, và kích thước phông chữ nhất quán trong toàn bộ ứng dụng.

Phần lựa chọn ngôn ngữ được thiết kế với bố cục ngang, có hai bộ chọn thả xuống được kết nối bằng một nút hoán đổi ở giữa. Nút hoán đổi sử dụng biểu tượng trao đổi để chỉ rõ chức năng. Các menu thả xuống được tạo kiểu với CSS tùy chỉnh để duy trì tính nhất quán hình ảnh và cải thiện khả năng sử dụng. Tùy chọn tự động nhận diện được làm nổi bật với kiểu dáng đặc biệt để người dùng dễ dàng nhận diện.

Khu vực dịch thuật chính sử dụng bố cục hai cột trên máy tính để bàn và bố cục xếp chồng trên thiết bị di động. Phần nhập liệu ở bên trái/trên cùng với phần kết quả ở bên phải/dưới cùng, tạo ra luồng đọc tự nhiên. Các vùng văn bản có chiều cao bằng nhau để duy trì cân bằng hình ảnh và khoảng cách nhất quán. Bộ đếm ký tự được đặt ở góc trên bên phải của mỗi phần với các chỉ báo mã màu (xanh lá bình thường, cam cảnh báo, đỏ nguy hiểm).
**Các yếu tố tương tác và phản hồi người dùng**

Các nút hành động được thiết kế với phân cấp hình ảnh rõ ràng: nút dịch chính sử dụng màu xanh lam nổi bật với kích thước lớn, các nút phụ (sao chép, phát âm, xóa) sử dụng kiểu màu xám tinh tế với kích thước nhỏ hơn. Trạng thái di chuột và trạng thái hoạt động được triển khai để cung cấp phản hồi hình ảnh ngay lập tức. Biểu tượng nút từ thư viện Font Awesome đảm bảo tương thích đa trình duyệt và vẻ ngoài chuyên nghiệp.

Hệ thống thông báo trạng thái sử dụng khu vực chuyên dụng bên dưới nội dung chính để hiển thị phản hồi thời gian thực. Thông báo thành công xuất hiện màu xanh lá, lỗi màu đỏ, cảnh báo màu cam, và thông báo thông tin màu xanh lam. Thông báo tự động ẩn sau 5 giây để tránh làm lộn xộn giao diện. Trạng thái tải được triển khai với spinner phủ lên để chỉ rõ trạng thái xử lý.

Hộp thoại modal cho các phần Giới thiệu và Trợ giúp sử dụng thiết kế phủ lên ở giữa với hiệu ứng làm mờ nền. Nội dung modal đáp ứng và có thể cuộn để phù hợp với độ dài nội dung khác nhau. Chức năng đóng có sẵn thông qua nút X và nhấp vào nền để cung cấp nhiều tùy chọn thoát.
**Triển khai thiết kế đáp ứng**

Phương pháp ưu tiên di động được áp dụng với các điểm ngắt tại 768px cho máy tính bảng và 1024px cho máy tính để bàn. Trên các thiết bị di động, bộ chọn ngôn ngữ xếp chồng theo chiều dọc, các vùng dịch thuật xếp chồng theo chiều dọc, và các nút trở thành chiều rộng đầy đủ để cải thiện tương tác cảm ứng. Kích thước phông chữ được điều chỉnh phù hợp cho các kích thước màn hình khác nhau để duy trì khả năng đọc.

Flexbox và CSS Grid được sử dụng rộng rãi để tạo bố cục linh hoạt thích ứng với các kích thước màn hình khác nhau. Chiều rộng tối đa của container được đặt để ngăn nội dung trở nên quá rộng trên các màn hình lớn. Đệm và lề được điều chỉnh một cách đáp ứng để duy trì khoảng cách phù hợp trên các thiết bị.

**Tính năng tiếp cận**

Các phần tử HTML5 ngữ nghĩa được sử dụng trong toàn bộ ứng dụng để cung cấp cấu trúc phù hợp cho trình đọc màn hình. Nhãn được liên kết chính xác với các điều khiển biểu mẫu, và các thuộc tính ARIA được thêm vào khi cần thiết. Điều hướng bằng bàn phím được hỗ trợ đầy đủ với thứ tự tab phù hợp và chỉ báo tiêu điểm.

Tỷ lệ tương phản màu sắc đáp ứng tiêu chuẩn WCAG 2.1 AA để đảm bảo khả năng đọc cho người dùng bị khuyết tật thị giác. Trạng thái tiêu điểm được hiển thị rõ ràng với kiểu viền. Thông báo lỗi được liên kết với các trường biểu mẫu để trình đọc màn hình có thể thông báo chúng một cách phù hợp.
**Các yếu tố thiết kế hình ảnh**

Bảng màu sử dụng bảng màu hiện đại, chuyên nghiệp với màu xanh lam chính (#2563eb), tông màu xám thứ cấp, và màu sắc ngữ nghĩa cho các chỉ báo trạng thái. Gradient và bóng mờ tinh tế được sử dụng một cách tiết kiệm để thêm chiều sâu mà không làm quá tải giao diện. Bán kính viền được nhất quán trong toàn bộ để tạo ngôn ngữ hình ảnh gắn kết.

Kiểu chữ sử dụng ngăn xếp phông hệ thống với phông dự phòng để đảm bảo hiệu suất tốt và khả năng đọc. Trọng lượng và kích thước phông được lựa chọn cẩn thận để tạo phân cấp rõ ràng. Chiều cao dòng và khoảng cách chữ được tối ưu hóa cho khả năng đọc trên các ngôn ngữ và chữ viết khác nhau.

**Cân nhắc về hiệu suất**

CSS được tối ưu hóa với các kiểu không sử dụng tối thiểu và bộ chọn hiệu quả. Biểu tượng Font Awesome được tải qua CDN với tập con chỉ chứa các biểu tượng cần thiết. Hình ảnh được tối ưu hóa và tải chậm khi thích hợp. Hoạt ảnh CSS được giữ nhẹ và tôn trọng sở thích của người dùng đối với chuyển động giảm.

Lưu trữ cục bộ được sử dụng để ghi nhớ sở thích của người dùng như ngôn ngữ được chọn lần cuối, cải thiện trải nghiệm người dùng qua các phiên. Chiến lược bộ nhớ đệm được triển khai để giảm các cuộc gọi API dư thừa và cải thiện thời gian phản hồi cho các bản dịch lặp lại.

## 3.7. Thiết kế API Endpoints

Thiết kế API của ứng dụng tuân thủ các nguyên tắc RESTful và được thiết kế để đơn giản, trực quan và có thể mở rộng. Toàn bộ các điểm cuối API được tổ chức dưới tiền tố `/api` để tách biệt rõ ràng khỏi việc phục vụ tệp tĩnh, và sử dụng các phương thức HTTP phù hợp cho mỗi loại thao tác.

**Cấu trúc điểm cuối và quy ước đặt tên**

Các điểm cuối API được thiết kế với tên rõ ràng, mô tả phản ánh chức năng của chúng. Cấu trúc URL cơ sở là `http://localhost:3000/api/{resource}` trong môi trường phát triển. Quy ước đặt tên sử dụng danh từ số nhiều cho các bộ sưu tập tài nguyên và tên hành động cụ thể cho các điểm cuối chức năng. Mã trạng thái HTTP được sử dụng chính xác để chỉ ra trạng thái phản hồi: 200 cho thành công, 400 cho lỗi client, 500 cho lỗi server.
**GET /api/languages - Điểm cuối ngôn ngữ được hỗ trợ**

Điểm cuối này trả về danh sách tất cả ngôn ngữ được hỗ trợ bởi Google Cloud Translation API. Phản hồi được lưu trong bộ nhớ đệm để cải thiện hiệu suất vì danh sách ngôn ngữ ít thay đổi. Việc triển khai sử dụng phương thức Google SDK `translate.getLanguages()` và định dạng kết quả thành cấu trúc thân thiện với người dùng với mã ngôn ngữ và tên hiển thị.

Định dạng yêu cầu không yêu cầu tham số. Cấu trúc phản hồi bao gồm cờ thành công, mảng ngôn ngữ với các ngôn ngữ phổ biến được ưu tiên, và tổng số để xử lý phía client. Xử lý lỗi bao gồm tình trạng không khả dụng của API và các vấn đề mạng với các phản hồi dự phòng phù hợp.

```javascript
// Response Example:
{
  "success": true,
  "languages": [
    { "code": "vi", "name": "Tiếng Việt" },
    { "code": "en", "name": "English" },
    { "code": "ko", "name": "한국어" },
    // ... more languages
  ],
  "total": 109
}
```

**POST /api/translate - Điểm cuối dịch thuật chính**

Điểm cuối cốt lõi của ứng dụng thực hiện dịch văn bản thực tế. Chấp nhận các yêu cầu POST với nội dung JSON chứa văn bản nguồn, ngôn ngữ nguồn (tùy chọn), và ngôn ngữ đích. Việc triển khai bao gồm xác thực đầu vào toàn diện, giới hạn tần suất, và xử lý lỗi để đảm bảo hoạt động mạnh mẽ.

Xác thực nội dung yêu cầu kiểm tra các trường bắt buộc, ràng buộc độ dài văn bản (tối đa 5000 ký tự), mã ngôn ngữ hợp lệ, và làm sạch văn bản để ngăn chặn các cuộc tấn công injection. Ngôn ngữ nguồn có thể được bỏ qua hoặc đặt thành "auto" để kích hoạt phát hiện ngôn ngữ tự động. Ngôn ngữ đích là trường bắt buộc.

Định dạng phản hồi bao gồm văn bản gốc, kết quả đã dịch, ngôn ngữ nguồn được phát hiện (nếu sử dụng tự động phát hiện), ngôn ngữ đích, và dấu thời gian cho mục đích theo dõi. Phản hồi lỗi cung cấp thông báo lỗi cụ thể để giúp người dùng hiểu và giải quyết vấn đề.

```javascript
// Request Example:
{
  "text": "Xin chào thế giới",
  "from": "auto", // or specific language code
  "to": "en"
}
// Success Response:
{
  "success": true,
  "originalText": "Xin chào thế giới",
  "translatedText": "Hello world",
  "fromLanguage": "vi",
  "toLanguage": "en",
  "timestamp": "2025-10-19T10:30:00.000Z"
}
```

**POST /api/detect - Điểm cuối phát hiện ngôn ngữ**

Điểm cuối chuyên dụng cho việc phát hiện ngôn ngữ tự động mà không thực hiện dịch thuật. Hữu ích khi người dùng muốn xác định ngôn ngữ của văn bản trước khi quyết định hướng dịch thuật. Việc triển khai sử dụng phương thức Google SDK `detect()` với tính điểm tin cậy.

Nội dung yêu cầu chỉ yêu cầu trường văn bản. Phản hồi bao gồm mã ngôn ngữ được phát hiện, tên ngôn ngữ, điểm tin cậy (0-1), và các phát hiện thay thế nếu tin cậy thấp. Xử lý lỗi bao gồm các trường hợp phát hiện thất bại hoặc văn bản quá ngắn để phát hiện đáng tin cậy.

```javascript
// Request Example:
{
  "text": "Bonjour le monde"
}
// Response Example:
{
  "success": true,
  "detectedLanguage": "fr",
  "languageName": "French",
  "confidence": 0.98,
  "alternatives": []
}
```

**GET /api/health - Điểm cuối kiểm tra sức khỏe**

Điểm cuối giám sát hệ thống để kiểm tra trạng thái ứng dụng và kết nối Google API. Trả về thông tin sức khỏe toàn diện bao gồm trạng thái máy chủ, kết nối API, thời gian phản hồi, và thông tin phiên bản. Quan trọng cho các hệ thống giám sát và cảnh báo.

Phản hồi bao gồm nhiều chỉ báo sức khỏe: thời gian hoạt động máy chủ, trạng thái Google API, thời gian phản hồi trung bình, tỷ lệ lỗi, và tải hiện tại. Thông tin được cấu trúc để hỗ trợ các công cụ giám sát tự động và cung cấp tóm tắt trạng thái có thể đọc được.

```javascript
// Response Example:
{
  "success": true,
  "status": "healthy",
  "checks": {
    "server": "up",
    "googleAPI": "connected",
    "responseTime": "1.2s",
    "uptime": "2h 15m"
  },
  "version": "1.0.0",
  "timestamp": "2025-10-19T10:30:00.000Z"
}
```

**Chiến lược xử lý lỗi**

Định dạng phản hồi lỗi nhất quán được sử dụng trên tất cả các điểm cuối để cung cấp xử lý lỗi phía client có thể dự đoán được. Phản hồi lỗi bao gồm cờ success: false, thông báo lỗi, mã lỗi để xử lý theo chương trình, và chi tiết tùy chọn cho mục đích gỡ lỗi.

Các loại lỗi khác nhau được xử lý phù hợp: lỗi xác thực (400), vấn đề xác thực (401), giới hạn tần suất (429), lỗi máy chủ (500), và dịch vụ không khả dụng (503). Thông báo lỗi được thiết kế để thân thiện với người dùng trong khi cung cấp đủ thông tin để khắc phục sự cố.

**Triển khai bảo mật**

Các biện pháp bảo mật API bao gồm xác thực đầu vào, giới hạn tần suất theo địa chỉ IP, cấu hình CORS để chỉ cho phép các nguồn gốc dự định, và bảo vệ khóa API thông qua biến môi trường. Ghi nhật ký yêu cầu được triển khai để giám sát và phân tích bảo mật trong khi tôn trọng quyền riêng tư của người dùng.

**Tối ưu hóa hiệu suất**

Bộ nhớ đệm phản hồi được triển khai cho dữ liệu tương đối tĩnh như danh sách ngôn ngữ được hỗ trợ. Nén yêu cầu/phản hồi được kích hoạt để giảm sử dụng băng thông. Các điểm cuối API được thiết kế để giảm thiểu truy vấn cơ sở dữ liệu và lệnh gọi API bên ngoài khi có thể.

**Tài liệu và kiểm thử API**

Tài liệu API toàn diện được duy trì với các ví dụ yêu cầu/phản hồi, mã lỗi, và hướng dẫn sử dụng. Bộ sưu tập Postman được cung cấp để dễ dàng kiểm thử và tích hợp. Chiến lược phiên bản API được thiết lập để hỗ trợ các cải tiến trong tương lai mà không làm hỏng các client hiện có.
