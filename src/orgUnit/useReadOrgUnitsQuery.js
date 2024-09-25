import { useDataQuery } from '@dhis2/app-runtime'

export const ORG_UNITS_QUERY = {
    orgUnits: {
        resource: 'organisationUnits.json?',
        params: {
            level: 3,
            pageSize: 160,
            fields: 'id,displayName,parent[id,name],children[id,displayName]',
            filter:['level:eq:3', 'organisationUnitGroups.name:ilike:kampala'],
            order: 'displayName:asc',
            rootJunction: 'OR'
        },
    },
}

export const useReadOrgUnitsQuery = () => useDataQuery(ORG_UNITS_QUERY)
