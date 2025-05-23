import {
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileEdit,
  FolderOpen,
  Globe,
  Lock,
  Menu,
  MoreHorizontal,
  Newspaper,
  Paperclip,
  PlusCircle,
  Settings,
  Shield,
  Trash2,
  AlertTriangle,
  AlertCircle,
  FileUp,
  FileCode,
  ExternalLink,
  Mail,
  Wallet,
  BanknoteIcon,
  FileIcon as FilePdf,
  FileTextIcon,
  FileSpreadsheet,
  FileImage,
  File,
  LayoutDashboard,
  Pill,
  RefreshCw,
  TrendingUpIcon,
  UserCircle,
  BarChart3,
  LogOut,
  User,
  Search,
  XCircle,
} from "lucide-react"

export const Icons = {
  spinner: RefreshCw,
  check: Check,
  mail: Mail,
  calendar: Calendar,
  user: User,
  settings: Settings,
  logOut: LogOut,
  sun: Sun,
  moon: Moon,
  copy: Copy,
  trash: Trash2,
  alertTriangle: AlertTriangle,
  alertCircle: AlertCircle,
  search: Search,
  plus: PlusCircle,
  download: Download,
  moreHorizontal: MoreHorizontal,
  fileText: FileTextIcon,
  building: Building2,
  creditCard: CreditCard,
  shield: Shield,
  barChart: BarChart3,
  fileUp: FileUp,
  folderOpen: FolderOpen,
  fileCode: FileCode,
  externalLink: ExternalLink,
  menu: Menu,
  lock: Lock,
  arrowRight: ArrowRight,
  checkCircle: CheckCircle2,
  wallet: Wallet,
  banknote: BanknoteIcon,
  filePdf: FilePdf,
  fileSpreadsheet: FileSpreadsheet,
  fileImage: FileImage,
  file: File,
  layoutDashboard: LayoutDashboard,
  pill: Pill,
  eye: Eye,
  fileEdit: FileEdit,
  xCircle: XCircle,
  globe: Globe,
  clock: Clock,
  newspaper: Newspaper,
  paperclip: Paperclip,
  trendingUp: TrendingUpIcon,
  userCircle: UserCircle,
}

function Sun(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function Moon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0-6 6 6 6 0 1 0 6-6z" />
    </svg>
  )
}

function Copy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.5 0-3-1-3-2.5S2.5 11 4 11h16c1.5 0 3 1 3 2.5S21.5 16 20 16H4z" />
      <rect width="14" height="14" x="2" y="2" rx="2" ry="2" />
    </svg>
  )
}
