// Class representing a custom response object
export class CustomResponse {
  // Status code of the response
  status: number;
  // Message associated with the response
  message: string;
  // Data payload of the response
  data: object;

  // Constructor to initialize the CustomResponse object
  constructor(status: number, message: string, data: object) {
    // Initialize status, message, and data properties
    this.status = status;
    this.message = message;
    this.data = data;
  }
}
