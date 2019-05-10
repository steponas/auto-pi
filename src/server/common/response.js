// Helpers for responses to the client.
module.exports = {
  success: data => ({
    status: true,
    error: null,
    data,
  }),
  error: (type, message) => ({
    status: false,
    error: { type, message },
    data: null,
  }),
};
