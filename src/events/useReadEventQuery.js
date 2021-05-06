import { useDataQuery } from '@dhis2/app-runtime'

export const EVENT_QUERY = {
    event: {
        resource: 'events',
        id: ({ id }) => id,
        params: {
            pageSize: 1,
            fields: 'event'
        },
    },
}

export const useReadEventQuery = id =>
    useDataQuery(EVENT_QUERY, {
        variables: { id },
    })
