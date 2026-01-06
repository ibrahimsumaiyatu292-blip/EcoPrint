import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSql } from "@/lib/db"

async function getMessages() {
  const sql = getSql()
  if (!sql) {
    return []
  }

  const messages = await sql`
    SELECT * FROM contact_messages
    ORDER BY created_at DESC
  `

  return messages
}

export default async function MessagesPage() {
  const messages = await getMessages()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "read":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "replied":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">View and manage customer inquiries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No messages yet</p>
            ) : (
              messages.map((message: any) => (
                <div key={message.id} className="p-4 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{message.name}</h3>
                        <Badge variant="secondary" className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {message.email} {message.phone && `• ${message.phone}`}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(message.created_at).toLocaleString()}</div>
                  </div>

                  {message.subject && (
                    <div className="mb-2">
                      <span className="font-medium text-sm">Subject: </span>
                      <span className="text-sm">{message.subject}</span>
                    </div>
                  )}

                  <p className="text-sm bg-muted p-3 rounded-lg">{message.message}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
