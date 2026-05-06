import { Card } from "./Card";

type DataStateVariant = "loading" | "empty" | "error" | "success";

export function DataState({
  variant,
  title,
  message
}: {
  variant: DataStateVariant;
  title: string;
  message?: string;
}) {
  const tones = {
    error: "text-error",
    loading: "text-primary",
    empty: "text-gray-400",
    success: "text-success",
  };

  return (
    <Card className="flex flex-col items-center justify-center border-dashed py-8 text-center md:py-10">
      <h3 className={`mb-1.5 text-lg font-semibold ${tones[variant]}`}>{title}</h3>
      {message && <p className="max-w-sm text-sm leading-6 text-slate-500">{message}</p>}
    </Card>
  );
}
