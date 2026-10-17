import { TabBar } from "@/components/TabBar";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <div className="pb-32">{children}</div>
      <TabBar />
    </>
  );
}
