"use client"

import type React from "react"

import Link from "next/link"
import { Users, Building2, FileText, FileCode } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface FolderProps {
  name: string
  icon: React.ReactNode
  count: number
  href: string
}

function FolderCard({ name, icon, count, href }: FolderProps) {
  return (
    <Link href={href}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <div className="mb-2 mt-2 rounded-full bg-primary/10 p-2 text-primary">{icon}</div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{count} documents</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function DocumentFolders() {
  const folders = [
    {
      name: "Patient Documents",
      icon: <Users className="h-6 w-6" />,
      count: 143,
      href: "/documents?tab=patients",
    },
    {
      name: "Organization Documents",
      icon: <Building2 className="h-6 w-6" />,
      count: 36,
      href: "/documents?tab=organization",
    },
    {
      name: "Policies & Procedures",
      icon: <FileText className="h-6 w-6" />,
      count: 27,
      href: "/documents?tab=policies",
    },
    {
      name: "Templates",
      icon: <FileCode className="h-6 w-6" />,
      count: 12,
      href: "/documents?tab=templates",
    },
  ]

  return (
    <>
      {folders.map((folder) => (
        <FolderCard key={folder.name} name={folder.name} icon={folder.icon} count={folder.count} href={folder.href} />
      ))}
    </>
  )
}

