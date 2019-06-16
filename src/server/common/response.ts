// Helpers for responses to the client.
interface SrvResponse {
  status: boolean;
  data: any;
  error: {
    type: string;
    message: string;
  } | null;
};

export const success = (data?: any): SrvResponse => ({
  status: true,
  error: null,
  data,
});

export const error = (type: string, message: string): SrvResponse => ({
  status: false,
  error: { type, message },
  data: null,
});
