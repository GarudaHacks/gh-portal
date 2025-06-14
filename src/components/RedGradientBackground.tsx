export default function GlassyRectangleBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-gray-600 bg-opacity-10 bg-white/5 backdrop-blur-md border-2 p-4 rounded-2xl shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
