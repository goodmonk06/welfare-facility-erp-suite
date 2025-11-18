'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  UserCog,
  AlertTriangle,
  FileText,
  CheckSquare,
  Building2,
} from 'lucide-react'

const navigation = [
  { name: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { name: '利用者管理', href: '/residents', icon: Users },
  { name: '職員管理', href: '/staff', icon: UserCog },
  { name: 'インシデント報告', href: '/incidents', icon: AlertTriangle },
  { name: '請求管理', href: '/claims', icon: FileText },
  { name: 'タスク管理', href: '/tasks', icon: CheckSquare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <Building2 className="h-8 w-8 text-blue-500" />
        <span className="ml-2 text-xl font-bold text-white">
          介護ERP
        </span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 text-xs text-gray-400">
        <p>Welfare Facility ERP Suite v0.1</p>
      </div>
    </div>
  )
}
