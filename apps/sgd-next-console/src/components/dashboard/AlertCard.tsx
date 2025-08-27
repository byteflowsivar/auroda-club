import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface AlertCardProps {
  title: string
  value: number
  link: string
  linkText: string
}

export function AlertCard({ title, value, link, linkText }: AlertCardProps) {
  if (value === 0) return null

  return (
    <Card className="border-yellow-500 bg-yellow-50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-yellow-800">{title}</CardTitle>
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-yellow-900">{value}</div>
        <Link href={link} className="text-xs text-yellow-700 hover:underline">
          {linkText}
        </Link>
      </CardContent>
    </Card>
  )
}
