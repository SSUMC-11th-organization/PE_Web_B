import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  // 조건을 만족하지 못했을 때 보여 줄 메시지
  errorMessage?: string;
  // 조건을 만족했을 때 보여 줄 메시지
  successMessage?: string;
  showError?: boolean;
  showSuccess?: boolean;
  // 입력칸 오른쪽에 붙는 버튼(중복 확인 등)
  action?: ReactNode;
}

// 라벨 + 입력칸 + 안내 문구를 같은 모양으로 그려요.
export function FormField({
  id,
  label,
  errorMessage,
  successMessage,
  showError = false,
  showSuccess = false,
  action,
  className,
  ...inputProps
}: FormFieldProps) {
  const messageId = `${id}-message`;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-text-primary" htmlFor={id}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-[10px] border bg-bg-surface px-4 text-sm text-text-primary outline-none placeholder:text-text-tertiary disabled:bg-bg-page disabled:text-text-tertiary",
            showError
              ? "border-red-500 focus:border-red-500"
              : "border-border-default focus:border-action-primary",
            className,
          )}
          aria-invalid={showError}
          aria-describedby={messageId}
          {...inputProps}
        />
        {action}
      </div>
      <p id={messageId} className="min-h-5 text-xs">
        {showError && errorMessage && <span className="text-red-600">{errorMessage}</span>}
        {!showError && showSuccess && successMessage && (
          <span className="text-action-primary">{successMessage}</span>
        )}
      </p>
    </div>
  );
}
