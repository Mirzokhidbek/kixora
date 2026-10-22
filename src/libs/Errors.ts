export enum HTTPCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data found!",
  CREATE_FAILED = "Create failed!",
  UPDATE_FAILED = "Update failed!",
  USED_NICK_PHONE = "You are inserting already used nick or phone!",
  USED_EMAIL = "This email is already registered. Please sign in!",
  NO_MEMBER_NICK = "No member with that nickname!",
  WRONG_PASSWORD = "Password is incorrect!",
  WRONG_CREDENTIALS = "Incorrect login or password!",
  BLOCKED_USER = "You have been blocked, please contact support!",
  NOT_AUTHENTICATED = "You are not authenticated, Please login first!",
  NOT_AUTHORIZED = "You are not allowed to perform this action!",
  TOKEN_CREATION_FAILED = "Token creation error!",
  BLANK_NOT_ALLOWED = "Required field cannot be blank!",
  INVALID_ID = "Invalid id format!",
  INVALID_INPUT = "Invalid input!",
  INVALID_GOOGLE_TOKEN = "Google sign-in could not be verified!",
  OUT_OF_STOCK = "Some products are unavailable or out of stock!",
  INVALID_STATUS_TRANSITION = "This order status change is not allowed!",
  INVALID_FILE = "Only JPG, PNG, WEBP or GIF images up to 5MB are allowed!",
  ADMIN_EXISTS = "An admin account already exists!",
  AI_UNAVAILABLE = "AI search is temporarily unavailable!",
}

class Errors extends Error {
  public code: HTTPCode;
  public message: Message | string;

  static standard = new Errors(
    HTTPCode.INTERNAL_SERVER_ERROR,
    Message.SOMETHING_WENT_WRONG
  );

  constructor(statusCode: HTTPCode, statusMessage: Message | string) {
    super(statusMessage);
    this.code = statusCode;
    this.message = statusMessage;
  }

  /** Public JSON shape sent to clients: { code, message } */
  toJSON() {
    return { code: this.code, message: this.message };
  }
}

export default Errors;
