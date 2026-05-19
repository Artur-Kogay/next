'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalError = ({ reset }: GlobalErrorProps) => {
  return (
    <html lang="en">
      <body>
        <div role="alert" style={{ padding: 24 }}>
          <h2>Application error</h2>
          <button type="button" onClick={reset}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
