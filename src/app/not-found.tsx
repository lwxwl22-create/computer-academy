import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="mt-3 text-xl font-bold">这一页不存在</h1>
        <p className="mt-2 text-sm text-muted-foreground">可能课程地址写错了，或者页面还没有生成。</p>
        <Link href="/" className="mt-6 inline-block">
          <Button>回到首页</Button>
        </Link>
      </div>
    </div>
  );
}
