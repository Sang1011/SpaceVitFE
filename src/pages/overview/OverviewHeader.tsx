export function OverviewHeader({ spaceName }: { spaceName: string }) {
  return (
    <div className="space-y-1">
      <h1 className="font-display-title text-display-title tracking-tight text-text-primary">Tổng quan</h1>
      <p className="font-body-default text-body-default text-text-secondary">Việc cần làm hôm nay trong {spaceName}.</p>
    </div>
  )
}
