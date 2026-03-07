

export const getBackendUrl = () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL
    if (url === "") {
        throw new Error("NEXT_PUBLIC_BACKEND_URL returning empty, is it set?")
    }
    return url
}
