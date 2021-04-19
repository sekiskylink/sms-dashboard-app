import { useDataQuery } from '@dhis2/app-runtime'
import {eventConfs, getUserOrg} from '../events'
import {useReadUserOrgUnit} from './useReadUserOrgUnit'
/*
const myParams = {
    program: eventConfs.program,
    paging: false,
    fields: 'event',
    orgUnit: '',
    ouMode: 'DESCENDANTS'
}
*/
const query = {
    events: {
        resource: 'events',
        params: {
            program: eventConfs.program,
            paging: false,
            fields: 'event',
            ouMode: 'DESCENDANTS'
        } 
    },
}
export const useReadUserEventIDs = (orgUnit) => {
    const {loading, error, data} = useDataQuery(query)
    if (error) {
        console.log("Failed to get User's  Events")
        return []
    }
    const events = data?.events?.events || []
    return events.map(e => e.event)
}
