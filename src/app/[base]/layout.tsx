export default function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <main>{children}</main>
      </div>
    );
  }
  