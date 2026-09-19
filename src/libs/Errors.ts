export enum HTTPCode {
  OK = 200,
  CREATED = 201,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum Message {
  SOMETHING_WENT_WRONG = "Something went wrong!",
  NO_DATA_FOUND = "No data found!",
  CREATE_FAILED = "Create failed!",
  UPDATE_FAILED = "Update failed!",
  USED_NICK_PHONE = "You are inserting already used nick or phone!",
  NO_MEMBER_NICK = "No member with that nickname!",
  WRONG_PASSWORD = "Password is incorrect!",
  BLOCKED_USER = "You have been blocked, please contact restaurant!",
  NOT_AUTHENTICATED = "You are not authenticated, Please login first!",
  TOKEN_CREATION_FAILED = "Token creation error!",
}

class Errors extends Error {
  public code: HTTPCode;
  public message: Message;

  static standard = new Errors(
    HTTPCode.INTERNAL_SERVER_ERROR,
    Message.SOMETHING_WENT_WRONG
  );

  constructor(statusCode: HTTPCode, statusMessage: Message) {
    super(statusMessage);
    this.code = statusCode;
    this.message = statusMessage;
  }
}

export default Errors;
