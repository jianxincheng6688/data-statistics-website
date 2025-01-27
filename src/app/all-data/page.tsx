import { getTablesExcludingUsers } from "@/lib/db"

export default async function AllDataPage() {
  let tables = []
  if (process.env.NODE_ENV !== "production") {
    tables = await getTablesExcludingUsers()
  }

  return (
    <div>
      <h1>所有数据</h1>
      {tables.length > 0 ? (
        <ul>
          {tables.map((table) => (
            <li key={table}>{table}</li>
          ))}
        </ul>
      ) : (
        <p>没有可用的数据或正在生产构建中。</p>
      )}
    </div>
  )
}

