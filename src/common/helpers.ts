// Wait for `timeout` ms as promise
export const waitFor = (timeout): Promise<void> => 
  new Promise((resolve): void => {
    setTimeout(resolve, timeout);
  });
