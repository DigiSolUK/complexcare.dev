import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/charts/bar-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { LineChart } from "@/components/charts/line-chart"

const SimpleDashboard = () => {
  const barChartData = [
    { label: "Jan", value: 10 },
    { label: "Feb", value: 20 },
    { label: "Mar", value: 15 },
    { label: "Apr", value: 25 },
    { label: "May", value: 22 },
  ]

  const pieChartData = [
    { label: "Category A", value: 40 },
    { label: "Category B", value: 25 },
    { label: "Category C", value: 35 },
  ]

  const lineChartData = [
    { x: 0, y: 20 },
    { x: 1, y: 30 },
    { x: 2, y: 25 },
    { x: 3, y: 40 },
    { x: 4, y: 35 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart data={barChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart data={pieChartData} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Website Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart data={lineChartData} />
        </CardContent>
      </Card>
    </div>
  )
}

export default SimpleDashboard
