import { getInstance } from 'd2'

export const eventConfs = {
    program: "iaN1DovM5em",
    eventType: "ILmx9NZX5GK",
    dateOfOnset: "KyQqGXUzThE",
    location: "MaR0lvrRkvR",
    nameOfSubmitter: "C8rAfbgOZir",
    phone: "fb9Fs09UNN8",
    rumorSource: "nvYHp4qr35Q",
    actionTaken: "Y9ahw4POban",
    followupAction: "ER1Z7hl3loe",
    status: "nFNdf8wcGNu",
    text: "Yb5K4WNhFcq",
    status_update_date: "Pwr85z28pXn",
    comment: "MYIDtPnvepJ",
    suspectedDisease: "elGqdsbgahz",
}

/* 'EOC Alert Verification Team', 'EOC Team', 'EOC Decision Team', 'EOC Core Staff', 'System Admin', 'National IDSR Team'*/
export const allowedUserGroups = ['PiU1BMFQrhR', 'w4QeiRn7fzy', 'tljMIEjx4gD', 'VE4GuHR9XJQ', 'LzzPKeMVe6j', 'Y1wNsABGXtK'] 

export const fetchEvent = async (eventID) => {
    const d2 = await getInstance()
    const api = d2.Api.getApi()
    const url = "events/" + eventID
    try {
        const {orgUnit, dataValues} = await api.get(
            url, {fields: "orgUnit,dataValues[dataElement,value]"})
        var cValues = {}
        const eValues = dataValues.map(i => {
            var y = {}
            const k = Object.keys(eventConfs).find(
                key => eventConfs[key] === i['dataElement'])
            y[k] = i['value']
            cValues[k] = i['value']
            return y
        })
        cValues['district'] = orgUnit
        cValues['notifyusers'] = []
        // console.log("Event Values", cValues)
        return cValues
    } catch {
        var cValues = {}
        console.log("Could not fetch even with ID: ", eventID)
        return cValues
    }
}

export const eventToMessage = (e) => {
    const {orgUnit, dataValues, created, event} = e
    var cValues = {}
    const eValues = dataValues.map(i => {
        var y = {}
        const k = Object.keys(eventConfs).find(
            key => eventConfs[key] === i['dataElement'])
        y[k] = i['value']
        cValues[k] = i['value']
        return y
    })
    cValues['district'] = orgUnit
    cValues['notifyusers'] = []
    cValues['receiveddate'] = created
    cValues['id'] = event
    return cValues
}

export const sendNotifications = async (messagePayLoad) => {
    const d2 = await getInstance()
    const api = d2.Api.getApi()
    try {
        await api.post("messageConversations", messagePayLoad)
    } catch {
        console.log("Error creating messageConversations:", messagePayLoad)
    }
}

export const saveEvent = async (eventPayload) => {
    const d2 = await getInstance()
    const api = d2.Api.getApi()
    try {
        await api.post("events", eventPayload)
    } catch {
        console.log("Error Saving Event: ", eventPayload)
    }
}

export const getUserEventIDs = async () => {
    const d2 = await getInstance()
    const api = d2.Api.getApi()

    const currentUser = d2.currentUser
    const orgUnitsModelCollection = await currentUser.getOrganisationUnits()
    const myOrgUnits = orgUnitsModelCollection.toArray().map(org => org.id)
    if (myOrgUnits.length > 0){
        console.log("Current User orgUnits:=======>", myOrgUnits)
        const defaulOrgUnit = myOrgUnits[0]
        console.log("Current User DEFAULT orgUnit:=======>", defaulOrgUnit)
        try {
            const { events } = await api.get("events", {
                program: eventConfs.program,
                paging: false,
                fields: 'event',
                orgUnit: defaulOrgUnit,
                ouMode: 'DESCENDANTS'
            })
            console.log("MY EVENTS:", events.map(e => e.event))
            return events.map(e => e.event)
        } catch {
            console.log("ERROR geting Events!")
            return []
        }
    }
    return []
}
