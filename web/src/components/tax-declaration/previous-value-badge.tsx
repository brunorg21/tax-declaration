export function PreviousValueBadge({ value }: { value: string }) {
  return <span className="text-sm text-red-500">Valor anterior - {value}</span>;
}
