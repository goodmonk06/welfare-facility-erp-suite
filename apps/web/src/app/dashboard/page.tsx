import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCog, AlertTriangle, CheckSquare } from 'lucide-react'

// ダミーデータ（本番ではAPIから取得）
const stats = {
  residents: { total: 42, active: 38 },
  staff: { total: 15, onDuty: 8 },
  incidents: { today: 2, thisWeek: 7 },
  tasks: { pending: 12, urgent: 3 },
}

const recentIncidents = [
  {
    id: '1',
    type: '転倒',
    severity: 'medium',
    resident: '山田 太郎',
    time: '14:30',
  },
  {
    id: '2',
    type: 'ヒヤリハット',
    severity: 'low',
    resident: '佐藤 花子',
    time: '10:15',
  },
]

const urgentTasks = [
  { id: '1', title: '介護記録の提出（本日締切）', assignee: '田中' },
  { id: '2', title: '医療機関への連絡', assignee: '鈴木' },
  { id: '3', title: 'ケアプラン更新', assignee: '高橋' },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <p className="text-gray-500 mt-2">
          本日の状況を確認できます
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              利用者数
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.residents.active}</div>
            <p className="text-xs text-muted-foreground">
              稼働中 / 総数 {stats.residents.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              出勤職員
            </CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staff.onDuty}</div>
            <p className="text-xs text-muted-foreground">
              本日の出勤 / 総数 {stats.staff.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              インシデント
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incidents.today}</div>
            <p className="text-xs text-muted-foreground">
              本日 / 今週 {stats.incidents.thisWeek}件
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              未完了タスク
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasks.pending}</div>
            <p className="text-xs text-muted-foreground">
              うち緊急 {stats.tasks.urgent}件
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* 最近のインシデント */}
        <Card>
          <CardHeader>
            <CardTitle>最近のインシデント</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{incident.type}</p>
                    <p className="text-sm text-gray-500">
                      {incident.resident} - {incident.time}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      incident.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : incident.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {incident.severity}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 緊急タスク */}
        <Card>
          <CardHeader>
            <CardTitle>緊急タスク</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 border-b pb-3 last:border-0"
                >
                  <CheckSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      担当: {task.assignee}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
