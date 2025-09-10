export default function Money({ value }: { value: number }) {
  const s = Number.isFinite(value) ? value.toFixed(2) : "0.00";
  return <span className="tabular-nums">{s}</span>;
}
