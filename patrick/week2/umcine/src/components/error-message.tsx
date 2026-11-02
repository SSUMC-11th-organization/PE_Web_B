interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="flex flex-col items-start gap-3">
      <p className="m-0 text-gray-500">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white"
      >
        다시 시도
      </button>
    </div>
  );
}