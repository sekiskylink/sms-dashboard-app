import { useDataQuery } from '@dhis2/app-runtime'

export const ORG_UNITS_QUERY = {
    me: {
        resource: 'me',
        params: {
            level: 3,
            pageSize: 150,
            fields: 'organisationUnits[id,displayName,level,parent[id,name],children[id,name,displayName,children[id,name,displayName]]]',
            order: 'asc',
        },
    },
}

export const useReadMeQuery = () => useDataQuery(ORG_UNITS_QUERY)
