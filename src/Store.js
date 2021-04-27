import { configure, makeAutoObservable } from "mobx";
import { getInstance } from 'd2'

configure({ enforceActions: "observed"});

class Store {
    d2
    IsGlobalUser = false;
    loading = false;
    defaultOrgUnit = ''
    districts = []
    userGroups = []
    /* 'EOC Alert Verification Team', 'EOC Team', 'EOC Decision Team', 
     * 'EOC Core Staff', 'System Admin', 'National IDSR Team'
     * */
    allowedUserGroups = [
        'PiU1BMFQrhR', 'w4QeiRn7fzy', 'tljMIEjx4gD', 
        'VE4GuHR9XJQ', 'LzzPKeMVe6j', 'Y1wNsABGXtK'
    ];

    constructor(d2){
        this.d2 = d2
        // console.log(d2)
        makeAutoObservable(this)
    }

    setLoading = (val) => this.loading = val;
    setUserGroups = val => this.userGroups = val
    setUserGlobalStatus = (val) => (this.IsGlobalUser = val)
    setDefaultOrgUnit = (val) => (this.defaultOrgUnit = val)
    setDistricts = (val) => (this.districts = val)

    fetchDefaults = async () => {
        this.setLoading(true)
        const [orgUnits, userGroups, orgs] = await Promise.all(
            [this.d2.currentUser.getOrganisationUnits({fields:'id,name'}), 
            this.d2.currentUser.getUserGroups({fields:'id,name'})
        ])
        console.log("===", orgUnits.toArray(), "---", userGroups.toArray())
        this.setUserGroups (userGroups.toArray()); 

        const groupIDs = userGroups.toArray().map(g => g.id)
        /* compare with the global allowedUserGroups - if any usergroup exists in global*/
        const isGlobal = groupIDs.some((val) => this.allowedUserGroups.indexOf(val) !== -1)
        this.setUserGlobalStatus(isGlobal)

        if (orgUnits.toArray().length > 0){
            this.setDefaultOrgUnit(orgUnits.toArray()[0].id)
        }

        /*set districts */
        getInstance().then(d2=>{
            const api = d2.Api.getApi()
            const p = api.get("organisationUnits", {
                level: "3",
                fields: "id,displayName",
                paging: false
            }) 
            Promise.all([p]).then(
                (values)=>{
                    // console.log(">>>>>>", values[0])
                    const {organisationUnits} = values[0]
                    this.setDistricts(organisationUnits)
                }
            )
            }
        )

        this.setLoading(false)
        
    }

    fetchDistricts = async () => {
        getInstance().then(d2=>{
                const api = d2.Api.getApi()
                const p = api.get("organisationUnits", {
                    level: "3",
                    fields: "id,displayName",
                    paging: false
                }) 
                Promise.all([p]).then(
                    (values)=>{
                        console.log(">>>>>>", values[0])
                        const {organisationUnits} = values[0]
                        this.setDistricts(organisationUnits)
                    }
                )
            }
        )
    }

    sendNotifications = async (messagePayLoad) => {
        getInstance().then(d2 => {
            const api = d2.Api.getApi() 
            try {
                api.post("messageConversations", messagePayLoad)
            } catch {
                console.log("Error creating messageConversations:", messagePayLoad)
            }
        })
    }

    saveEvent = async (eventPayload) => {
        getInstance().then(d2 => {
            const api = d2.Api.getApi()
            try {
                api.post("events", eventPayload)
            } catch {
                console.log("Error Saving Event: ", eventPayload)
            }
        })
    }

    fetchEvent = async (eventID) => {
        getInstance.then(d2 => {
            const api = d2.Api.getApi()
            const url = "events/" + eventID
            try {
                const {orgUnit, dataValues} = api.get(
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
        })
    }


}

export default Store;
