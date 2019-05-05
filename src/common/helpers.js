module.exports = {
  // Wait for `timeout` ms as promise
  waitFor: timeout => new Promise(resolve => setTimeout(resolve, timeout)),
};
