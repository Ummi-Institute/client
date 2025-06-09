type TErrorType =
    | 'AuthorizationError'
    | 'ValidationError'
    | 'StripeInvalidRequestError'
    | 'InternalServerError'

export interface ResponseFormat<T> {
    status: 'success' | 'error'
    message: string
    data: T
    error?: {
        code: string | number
        type: TErrorType
    }
    timestamp: string
}

export interface Paginated {
    page: number
    pages: number
    total: number
    totalResult: number
}
