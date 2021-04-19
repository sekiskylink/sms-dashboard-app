import { useDataQuery } from '@dhis2/app-runtime'

export const USER_ORGS_QUERY = {
    orgs: {
        resource: 'me',
        params: {
            fields: 'organisationUnits[id]'
        },
    },
}

export const useReadUserOrgUnit = () => {
    const {loading, error, data} = useDataQuery(USER_ORGS_QUERY)
    if (error) {
        console.log("Failed to get User's OrgUnit")
        return ""
    }
    const orgUnits = data?.orgs?.organisationUnits || []
    if (orgUnits.length > 0){
        const orgs = orgUnits.map(org => org.id)
        return orgs[0]

    }
    return ""

}
