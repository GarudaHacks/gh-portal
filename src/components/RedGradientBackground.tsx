export default function RedGradientBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-r from-[#A03737] to-[#602121] ${className}`}
    >
      {children}
    </div>
  );
}
