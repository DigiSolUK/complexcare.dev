import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function LiveLoginLoading() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Skeleton className="h-8 w-[200px] mx-auto" />
          <Skeleton className="h-4 w-[250px] mx-auto" />
        </div>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-center">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
            <Skeleton className="h-4 w-[200px] mx-auto" />
            <Skeleton className="h-4 w-[250px] mx-auto" />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
