import { BarChart, Calendar, CreditCard, Home, Settings, Shield, Users } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Care Professionals",
    href: "/care-professionals",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Timesheets",
    href: "/timesheets",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: "Compliance",
    href: "/compliance",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

