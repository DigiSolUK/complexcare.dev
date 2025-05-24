import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProviderAvailabilityLoading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-4 w-[250px] mt-2" />
      </div>

      <Tabs defaultValue="availability" className="space-y-6">
        <TabsList>
          <TabsTrigger value="availability">Availability Calendar</TabsTrigger>
          <TabsTrigger value="time-off">Time Off Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[150px] mt-2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-[100px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[600px] w-full" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="time-off">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[150px] mt-2" />
                </div>
                <Skeleton className="h-10 w-[150px]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[100px] w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
