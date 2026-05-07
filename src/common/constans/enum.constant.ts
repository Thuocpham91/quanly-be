export enum StatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  NEW = "NEW",
}

export enum StatusEnumUserRoleGroup {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}
export enum StatusProcessEnum {
  COMPLETED = "COMPLETED",
  INPROGRESS = "INPROGRESS",
  WAIT = "WAIT",
  NEW = "NEW",
  DONE = "DONE",
  CANCEL = "CANCEL",
}

// User
export enum UserRoleEnum {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
}

export enum UserPermission {
  VIEW = "VIEW",
  COMMENT = "COMMENT",
  EDIT = "EDIT",
}

export enum UserGender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// language
export const UserLanguageType = {
  vi: "vi-VN",
  en: "en-US",
  kr: "ko-KR",
};

export const Env = {
  DEV: "development",
  SIT: "sit",
  STAGING: "staging",
  PRODUCTION: "production",
};

//redis Queue
export enum QueueName {
  MAIL = "mail",
  OTP = "otp",
  SECURITY = "security",
  TOKEN_CLEANUP = "token-cleanup",
}

export enum MailJob {
  SEND_CONFIRM_ADD_POINT = "send-confirm-add-point-email",
}

export const PermissionKEy = [
  {
    key: "UPDATE_PERMISSION",
    description: "Update perrmision",
  },
  {
    key: "UPDATE_PERMISSION_GROUP",
    description: "Updat sub permission group",
  },
  {
    key: "CREATE_SUB_PERMISSION",
    description: "Create sub permission",
  },
  {
    key: "CREATE_PERMISSION",
    description: "Create  permission",
  },
  {
    key: "DELETE_PERMISSION",
    description: "Delete  permission",
  },
];

export enum FbGroupType {
  BUY_SELL = "MUA_BAN",
  TECHNICAL = "KY_THUAT",
  COMMUNITY = "CONG_DONG",
  LOCAL = "VUNG_MIEN",
  OTHER = "KHAC",
}
