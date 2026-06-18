export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t bg-background px-4 py-3 lg:px-6">
      <p className="text-center text-xs text-muted-foreground sm:text-left">
        Tournament Engine Web &copy; {year}
      </p>
    </footer>
  );
}
