import { useDataQuery } from '@dhis2/app-runtime'

/* 'EOC Alert Verification Team', 'EOC Team', 'EOC Decision Team', 'EOC Core Staff', 'System Admin', 'National IDSR Team'*/
export const allowedUserGroups = ['PiU1BMFQrhR', 'w4QeiRn7fzy', 'tljMIEjx4gD', 'VE4GuHR9XJQ', 'LzzPKeMVe6j', 'Y1wNsABGXtK']
export const USER_GROUPS_QUERY = {
    userGroups: {
        resource: 'me',
        params: {
            fields: 'userGroups[id]'
        },
    },
}

export const useReadUserIsGlobal = () =>{
    const {loading, error, data} = useDataQuery(USER_GROUPS_QUERY)
    if (error) {
        console.log("Failed to get User's  UserGroups")
        return false
    }
    const groups = data?.userGroups?.userGroups || []
    if (groups.length > 0){
        const groupIDs = groups.map(g => g.id)
        /* compare with the global allowedUserGroups - if any usergroup exists in global*/
        return groupIDs.some((val) => allowedUserGroups.indexOf(val) !== -1)
    }
    return false

}
