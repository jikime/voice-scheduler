import { Navbar } from '@/components/panel/navbar';

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="h-screen overflow-auto">{children}</div>
    </div>
  );
}
