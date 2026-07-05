export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-6 px-4 safe-bottom">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} InfoOly Track. All rights reserved.
        </p>
        <p className="text-xs text-muted/60 mt-1">
          信息学奥林匹克竞赛生涯记录平台
        </p>
      </div>
    </footer>
  )
}
