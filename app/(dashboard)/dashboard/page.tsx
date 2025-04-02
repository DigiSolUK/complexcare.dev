import { DemoBanner } from "@/components/demo-banner"

export default function DashboardPage() {
  return (
    <div className="container mx-auto">
      <DemoBanner />
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Patients</h2>
          <p className="text-3xl font-bold">128</p>
          <p className="text-sm text-gray-500">Total patients</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Appointments</h2>
          <p className="text-3xl font-bold">47</p>
          <p className="text-sm text-gray-500">Scheduled this week</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          <p className="text-3xl font-bold">23</p>
          <p className="text-sm text-gray-500">Pending tasks</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span>Patient assessment completed for John Doe</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span>Medication updated for Sarah Smith</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              <span>New care plan created for Michael Johnson</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              <span>Appointment rescheduled for Emily Brown</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
          <ul className="space-y-4">
            <li className="flex justify-between">
              <span>Dr. Smith with John Doe</span>
              <span className="text-gray-500">Today, 2:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Dr. Johnson with Sarah Smith</span>
              <span className="text-gray-500">Tomorrow, 10:30 AM</span>
            </li>
            <li className="flex justify-between">
              <span>Dr. Williams with Michael Johnson</span>
              <span className="text-gray-500">Wed, 3:15 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Dr. Brown with Emily Brown</span>
              <span className="text-gray-500">Thu, 9:00 AM</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

