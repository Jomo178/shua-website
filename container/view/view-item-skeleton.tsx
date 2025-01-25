import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface ViewItemSkeletonProps
  extends React.ButtonHTMLAttributes<HTMLDivElement> {}

export function ViewItemSkeleton({
  className,
  ...props
}: ViewItemSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Skeleton className="h-[266px] w-[200px]"></Skeleton>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}

export function SkeletonViewGroup() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[360px]" />
        </div>
        <div className="flex space-x-1">
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
      <Separator className="my-4" />
      <div>
        <div className="w-72">
          <div className="flex space-x-4 pb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <ViewItemSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
