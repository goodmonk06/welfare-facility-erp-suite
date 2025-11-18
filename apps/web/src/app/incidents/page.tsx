import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle } from 'lucide-react'

const incidents = [
  {
    id: '1',
    type: '転倒',
    severity: 'high',
    resident: '山田 太郎',
    reporter: '高橋 美咲',
    occurredAt: '2024-01-20 14:30',
    status: 'reported',
  },
  {
    id: '2',
    type: 'ヒヤリハット',
    severity: 'low',
    resident: '佐藤 花子',
    reporter: '伊藤 翔太',
    occurredAt: '2024-01-20 10:15',
    status: 'reviewed',
  },
  {
    id: '3',
    type: '誤薬',
    severity: 'critical',
    resident: '鈴木 一郎',
    reporter: '田中 健一',
    occurredAt: '2024-01-19 08:00',
    status: 'closed',
  },
]

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
}

const statusLabels = {
  reported: '報告済',
  reviewed: '確認済',
  closed: '対応完了',
}

export default function IncidentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">インシデント報告</h1>
          <p className="text-gray-500 mt-2">
            事故・ヒヤリハットの報告と管理
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規報告
        </Button>
      </div>

      {/* 統計サマリ */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">今日</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2件</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">今週</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7件</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">今月</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23件</div>
          </CardContent>
        </Card>
      </div>

      {/* インシデント一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>インシデント一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      <h3 className="font-semibold text-lg">
                        {incident.type}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          severityColors[
                            incident.severity as keyof typeof severityColors
                          ]
                        }`}
                      >
                        {incident.severity}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                        {statusLabels[incident.status as keyof typeof statusLabels]}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">対象者:</span>{' '}
                        {incident.resident}
                      </div>
                      <div>
                        <span className="font-medium">報告者:</span>{' '}
                        {incident.reporter}
                      </div>
                      <div>
                        <span className="font-medium">発生日時:</span>{' '}
                        {incident.occurredAt}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
