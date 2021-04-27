export const createSearchString = query => {
    const queryString = Object.keys(query)
        .reduce((acc, paramKey) => {
            const paramValue = query[paramKey]

            if (paramValue) {
                acc.push(`${paramKey}=${encodeURIComponent(paramValue)}`)
            }
            return acc
        }, [])
        .join('&')

    return `?${queryString}`
}
