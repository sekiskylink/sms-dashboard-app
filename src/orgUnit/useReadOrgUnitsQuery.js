import { useDataQuery } from '@dhis2/app-runtime'

export const ORG_UNITS_QUERY = {
    orgUnits: {
        resource: 'organisationUnits',
        params: {
            level: 3,
            pageSize: 150,
            fields: 'id,displayName,parent[id,name]',
            order: 'asc',
        },
    },
}

export const useReadOrgUnitsQuery = () => useDataQuery(ORG_UNITS_QUERY)
