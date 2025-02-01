type DashboardShellProps = React.HTMLAttributes<HTMLDivElement>

export function DashboardShell({
  children,
  ...props
}: DashboardShellProps) {
  return (
    <div className="container mx-auto py-8" {...props}>
      {children}
    </div>
  );
}
