export const isServerError = (error: unknown) => {
    if (error && typeof error === 'object' && 'data' in error) return true
    return false
}
