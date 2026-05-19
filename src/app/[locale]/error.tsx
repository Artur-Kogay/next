'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
     
    console.error(error);
  }, [error]);

  return (
    <div role="alert" style={{ padding: 24 }}>
      <h2>Something went wrong</h2>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
};

export default ErrorPage;
