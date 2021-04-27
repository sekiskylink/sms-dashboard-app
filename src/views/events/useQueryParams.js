import { useLocation } from 'react-router-dom'

export const useQueryParams = (defaultOrg) => {
    const searchParams = new URLSearchParams(useLocation().search)
    
    console.log("Current User Default OrgUnit:", defaultOrg)
    return {
        orgUnit: searchParams.get('orgUnit') || defaultOrg ? defaultOrg: '',
        page: parseInt(searchParams.get('page') || 1),
        pageSize: parseInt(searchParams.get('pageSize') || 50),
    }
}
