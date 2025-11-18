import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, TrendingUp } from 'lucide-react'

const claims = [
  {
    id: '1',
    yearMonth: '2024-01',
    amount: 4280000,
    status: 'submitted',
    billingDate: '2024-02-10',
  },
  {
    id: '2',
    yearMonth: '2023-12',
    amount: 4150000,
    status: 'paid',
    billingDate: '2024-01-10',
    paymentDate: '2024-01-31',
  },
  {
    id: '3',
    yearMonth: '2023-11',
    amount: 4320000,
    status: 'paid',
    billingDate: '2023-12-10',
    paymentDate: '2023-12-28',
  },
]

const statusLabels = {
  draft: '下書き',
  submitted: '提出済',
  approved: '承認済',
  paid: '入金済',
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  approved: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
}

export default function ClaimsPage() {
  const totalAmount = claims.reduce((sum, claim) => sum + claim.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">請求管理</h1>
          <p className="text-gray-500 mt-2">
            介護報酬請求の管理
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          新規請求作成
        </Button>
      </div>

      {/* サマリ */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              直近3ヶ月合計
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{totalAmount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              当月（2024年1月）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥4,280,000</div>
            <p className="text-xs text-green-600 mt-1">
              前月比 +3.1%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              未入金請求
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1件</div>
            <p className="text-xs text-muted-foreground mt-1">
              ¥4,280,000
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 請求一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>請求一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">対象月</th>
                  <th className="text-left py-3 px-4">請求額</th>
                  <th className="text-left py-3 px-4">提出日</th>
                  <th className="text-left py-3 px-4">入金日</th>
                  <th className="text-left py-3 px-4">ステータス</th>
                  <th className="text-left py-3 px-4">アクション</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {claim.yearMonth}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ¥{claim.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{claim.billingDate}</td>
                    <td className="py-3 px-4">
                      {claim.paymentDate || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm ${
                          statusColors[claim.status as keyof typeof statusColors]
                        }`}
                      >
                        {statusLabels[claim.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        詳細
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
