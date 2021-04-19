import { useDataQuery } from '@dhis2/app-runtime'

export const OPTION_SET_QUERY = {
    optionSets: {
        resource: 'optionSets',
        id: ({id}) => id,
        params: {
            pageSize: 20,
            fields: 'id,options[id,name,code]',
            order: 'asc',
        },
    },
}

export const queryOptionSet = (engine, variables) =>
    engine.query(OPTION_SET_QUERY, { variables })

export const useReadOptionSetQuery = id =>
    useDataQuery(OPTION_SET_QUERY, {
        variables: { id },
    })
