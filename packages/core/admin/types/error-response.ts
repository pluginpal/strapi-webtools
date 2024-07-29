export interface ErrorResponse {
  response: {
    payload: Array<{ message: string }>;
  };
}
