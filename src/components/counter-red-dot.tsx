interface CounterRedDotProps {
  count: number;
}

export default function CounterRedDot({ count }: CounterRedDotProps) {
  if (count === 0) return null;
  return (
    <span className="text-primary-foreground absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-xs font-medium tabular-nums">
      {count}
    </span>
  );
}
