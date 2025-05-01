import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface RoadmapItem {
  date: string
  title: string
  description: string
}

const roadmapItems: RoadmapItem[] = [
  {
    date: "May 2024",
    title: "MVP Definition",
    description: "Defined core features for the Minimum Viable Product (MVP).",
  },
  {
    date: "June 2024",
    title: "UI/UX Design",
    description: "Designed user interface and user experience for core CRM functionality.",
  },
  {
    date: "July - August 2024",
    title: "Development Phase",
    description: "Developing the core functionality of the CRM.",
  },
  {
    date: "September 2024",
    title: "Testing and Refinement",
    description: "Rigorous testing of core features and refinement based on test results.",
  },
  {
    date: "October 2024",
    title: "Birmingham Care Show Launch",
    description: "Official product launch at the Birmingham Care Show.",
  },
]

export const metadata: Metadata = {
  title: "Roadmap | ComplexCare CRM",
  description: "Roadmap for the ComplexCare CRM",
}

export default function RoadmapPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Roadmap</h1>
      <p className="text-center text-gray-600 mb-12">Our journey to revolutionize complex care management.</p>

      <div className="grid gap-8">
        {roadmapItems.map((item, index) => (
          <div key={index} className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-500">{item.date}</p>
            <p className="mt-2">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Future Features</h2>
        <p className="text-gray-600 mb-6">Features planned for upcoming releases.</p>
        <ul className="list-disc list-inside text-left inline-block">
          <li>Advanced Analytics and Reporting</li>
          <li>Integration with NHS Systems</li>
          <li>Mobile App for Caregivers</li>
          <li>AI-Powered Care Suggestions</li>
        </ul>
        <Link href="/contact">
          <Button className="mt-8">
            Contact Us <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
