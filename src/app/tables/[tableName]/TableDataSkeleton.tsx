import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TableDataSkeleton() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-[200px]" />
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {[...Array(5)].map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-[100px]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(5)].map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

