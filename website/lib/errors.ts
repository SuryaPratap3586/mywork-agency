export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}
