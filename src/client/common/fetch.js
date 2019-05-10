export const getPiData = async (url) => {
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
