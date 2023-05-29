import React from 'react';

interface Props {
  children: React.ReactNode;
}

/**
 * Timer component makes children refresh every second.
 */
export const Timer = ({children}: Props) => {
  const [_, toggle] = React.useState(false);
  React.useEffect(() => {
    const interval = setInterval(() => toggle(v => !v), 1000);
    return () => clearInterval(interval);
  }, []);

  return children;
};
