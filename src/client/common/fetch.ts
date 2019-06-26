export const getPiData = async (url): Promise<any> => {
  const result = await fetch(`/pi/${url}`);
  if (!result.ok) {
    throw result.statusText;
  }

  const { data, status, error } = await result.json();

  if (status) {
    return data;
  }
  throw error;
};

export const postPiData = async(url, body = {}): Promise<any> => {
  const result = await fetch(`/pi/${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  
  if (!result.ok) {
    throw result.statusText;
  }

  const { data, status, error } = await result.json();

  if (status) {
    return data;
  }
  throw error;
};
