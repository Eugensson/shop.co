import { CheckCircle } from "lucide-react";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="p-3 flex items-center gap-x-2 text-sm rounded-md text-emerald-500 bg-emerald-500/15"
    >
      <CheckCircle size={16} />
      <p>{message}</p>
    </div>
  );
};
