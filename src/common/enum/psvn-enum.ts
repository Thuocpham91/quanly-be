export enum StatusEnum {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMPLETED = "COMPLETED",
}
export enum ServiceTaskStatusEnum {
  NEW = "NEW",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  WAIT = "WAIT",
}
export enum ServiceTaskTypeEnum {
  DESIGN = "DESIGN",
  QC = "QC",
}
export enum ShapeTypeEnum {
  START = "START",
  MISSION = "MISSION",
  PROCESS = "PROCESS",
  DECISION = "DECISION",
  END = "END",
}

export enum UserRole {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  QC = "QC",
  CUSTOMER = "CUSTOMER",
  COLLABORATOR = "COLLABORATOR",
}

export enum ServiceType {
  BASIC = "BASIC",
  ADVANCED = "ADVANCED",
  PREMIUM = "PREMIUM",
  CUSTOM = "CUSTOM",
}

export enum NeuronStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
export enum shareStatus {
  SHARE = "SHARE",
}
export enum RoleStore {
  EDIT = "EDIT",
  VIEW = "VIEW",
}

export enum OrderStatusEnum {
  NEW = "NEW", // Mới
  QUOTE = "QUOTE", // Báo giá
  UNPAID = "UNPAID", // Chờ thanh toán
  PROCESSING = "PROCESSING", // Đang thực hiện
  HANDOVER = "HANDOVER", // Chờ bàn giao
  COMPLETED = "COMPLETED", // Hoàn thành
  REVISIONS = "REVISIONS", // Sửa
  CANCELLED = "CANCELLED", // Đã hủy
}

export enum OrderSubmitType {
  CREATE_ORDER = "CREATE_ORDER",
  ADD_TO_CART = "ADD_TO_CART",
  PENDING_QUOTE = "PENDING_QUOTE",
  UPDATE_ORDER = "UPDATE_ORDER",
}

export enum PaymentType {
  IMMEDIATE = "IMMEDIATE",
  QUOTE = "QUOTE",
  QUOTE_NO_CONFIRM = "QUOTE_NO_CONFIRM",
}

export enum OrderItemStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DELIVERED = "DELIVERED",
  REJECTED = "REJECTED",
  NEW = "NEW",
  HANDOVER = "HANDOVER",
  REVISIONS = "REVISIONS",
  COMPLETED = "COMPLETED",
}

export enum TransactionType {
  EARN = "EARN",
  SPEND = "SPEND",
  BUY = "BUY",
  ADMIN_ADJUST = "ADMIN_ADJUST",
}

export enum NotificationType {
  TASK_ASSIGNED = "TASK_ASSIGNED",
  ORDER_UPDATED = "ORDER_UPDATED",
  POINT_CHANGED = "POINT_CHANGED",
  SYSTEM = "SYSTEM",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  ORDER_COMPLETED = "ORDER_COMPLETED",
}

export enum NotificationReadStatus {
  ALL = "ALL",
  READ = "READ",
  UNREAD = "UNREAD",
}

export enum DiscountType {
  PERCENT = "PERCENT",
  AMOUNT = "AMOUNT",
}

export enum MediaTypeEnum {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
}

// Trạng thái tài khoản người dùng
export enum UserStatusEnum {
  ACTIVE = "ACTIVE", // Hoạt động bình thường
  INACTIVE = "INACTIVE", // Không hoạt động
  BANNED = "BANNED", // Bị cấm
  LOCKED = "LOCKED", // Bị khóa tạm thời
  UNDER_REVIEW = "UNDER_REVIEW", // Đang xem xét
  DELETED = "DELETED", // Đã xóa (hoặc chờ xóa)
}

// Giới tính
export enum GenderEnum {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// Trạng thái tổ chức
export enum OrganizationStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED", // Tạm dừng hoạt động
  DELETED = "DELETED",
}

// Loại báo cáo vi phạm
export enum ViolationTypeEnum {
  BUG = "BUG",
  SPAM = "SPAM",
  ABUSE = "ABUSE",
  FEATURE_REQUEST = "FEATURE_REQUEST",
  OTHER = "OTHER",
}

// Trạng thái xử lý báo cáo vi phạm
export enum ViolationStatusEnum {
  NEW = "NEW", // Mới tạo
  IN_PROGRESS = "IN_PROGRESS", // Đang xử lý
  WAITING = "WAITING", // Chờ phản hồi
  CLOSED = "CLOSED", // Đã đóng
}

// Kết quả xử lý báo cáo vi phạm
export enum ViolationResultEnum {
  NO_VIOLATION = "NO_VIOLATION", // Không vi phạm
  LEVEL_1 = "LEVEL_1", // Nhắc nhở
  LEVEL_2 = "LEVEL_2", // Cảnh cáo
  LEVEL_3 = "LEVEL_3", // Khóa tạm thời
  LEVEL_4 = "LEVEL_4", // Cấm vĩnh viễn
}

// Danh mục chính sách
export enum PolicyCategoryEnum {
  TERMS = "TERMS", // Điều khoản dịch vụ
  PRIVACY = "PRIVACY", // Chính sách bảo mật
  COMMUNITY = "COMMUNITY", // Quy tắc cộng đồng
}

export enum RoleCodeEnum {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  COLLABORATOR = "COLLABORATOR",
}

export enum UserTypeEnum {
  EXTERNAL = "EXTERNAL",
  INTERNAL = "INTERNAL",
}

export enum SortOrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}

//Point
export enum PointType {
  PAY_NOW = "PAY_NOW",
  PAY_LATER = "PAY_LATER",
}

//Payment
export enum PaymentMethod {
  PAYPAL = "PAYPAL",
  VNPAY = "VNPAY",
}

export enum OrderPaymentStatusEnum {
  PENDING = "PENDING", // Mới tạo giao dịch, chờ thanh toán
  PAID = "PAID", // Thanh toán thành công
  FAILED = "FAILED", // Thanh toán thất bại
  CANCELLED = "CANCELLED", // User hủy thanh toán
  REFUNDED = "REFUNDED", // Đã hoàn tiền
}

export enum OrderPaymentMethod {
  POINT = "POINT",
  PAYPAL = "PAYPAL",
}

export enum WalletType {
  POINT = "POINT",
  PAYPAL = "PAYPAL",
}

export enum StatusTransactionEnum {
  PENDING = "PENDING", // Chờ xác nhận từ PayPal
  COMPLETED = "COMPLETED", // Thành công
  FAILED = "FAILED", // Thất bại
  CANCELED = "CANCELED", // Người dùng hủy
}

export enum WalletTransactionType {
  CREDIT = "CREDIT", // cộng điểm (nạp, khuyến mãi, refund)
  DEBIT = "DEBIT", // trừ điểm (thanh toán order)
  PURCHASE = "PURCHASE", // mua điểm qua PayPal
  POINT_PURCHASE = "POINT_PURCHASE", // Mua point bằng PayPal
  ORDER_PAYMENT = "ORDER_PAYMENT", // Thanh toán order bằng point
  ORDER_REFUND = "ORDER_REFUND", // Hoàn tiền order
  TRANSFER = "TRANSFER", // Chuyển point giữa users
  DEPOSIT = "DEPOSIT", // Nạp tiền/point
  WITHDRAW = "WITHDRAW", // Rút tiền/point
}

export enum VoucherType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

//Audit
export enum ActionTypeEnum {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  SOFT_DELETE = "SOFT_DELETE",
  TRANSACTION_ROLLBACK = "TRANSACTION_ROLLBACK",
}

export enum LocationStatusEnum {
  NEW = "NEW", //Khởi tạo
  OPEN = "OPEN", // Bàn giao/tổng – Nhóm tồn tại, còn item hoạt động - Khi được tạo mới
  EXCEPTION = "EXCEPTION", // Có vấn đề (dựa cờ từ service: yêu cầu sửa)
  COMPLETED = "COMPLETED", // Hoàn thành
  CANCELLED = "CANCELLED", // Đã hủy
}

export enum LocationServiceStatusEnum {
  NEW = "NEW", // Mới
  PROCESSING = "PROCESSING", // Đang thực hiện
  HANDOVER = "HANDOVER", // Chờ bàn giao
  COMPLETED = "COMPLETED", // Hoàn thành
  REVISIONS = "REVISIONS", // Sửa
  CANCELLED = "CANCELLED", // Đã hủy
}

export enum OrderProposalStatusEnum {
  CHO_DUYET = "CHO_DUYET",
  DA_DUYET = "DA_DUYET",
  TU_CHOI = "TU_CHOI",
  DA_HOAN_THANH = "DA_HOAN_THANH",
  HUY_DON = "HUY_DON",
}

export enum OrderTypeEnum {
  DAT_GA = "DAT_GA",
  MUA_GA = "MUA_GA",
}
