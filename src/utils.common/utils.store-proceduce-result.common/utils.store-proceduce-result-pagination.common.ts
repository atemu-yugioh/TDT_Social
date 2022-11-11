export interface StoreProcedureResultPagination<T> {
    total_record: number
    data: T[]
}