import { configure, makeAutoObservable } from "mobx";
import { getInstance } from 'd2'
import moment from "moment";

configure({ enforceActions: "observed" });

class Store {
    d2 = null
    IsGlobalUser = false;
    loading = false;
    defaultOrgUnit = ''
    userOrgUnits = []
    userRegions = []
    searchOrgUnit = ''
    districts = []
    userGroups = []
    filteringPeriod = "THIS_WEEK"
    filteringOrgUnit = ''
    caseTypeHumanSelected = false
    caseTypeAnimalSelected = false
    caseVerificationDeskSelected = false
    daysDisabled = false
    monthsDisabled = false
    yearsDisabled = false
    activeSignalTabKey = "signalDetails"
    activeNewSignalTabKey = "newSignalDetails"
    activeForwardSignalTabKey = "forward-signalDetails"
    /* 'EOC Alert Verification Team', 'EOC Team', 'EOC Decision Team',
     * 'EOC Core Staff', 'System Admin', 'National IDSR Team'
     * */
    allowedUserGroups = [
        'PiU1BMFQrhR', 'enC5vRupltp', 'tljMIEjx4gD',
        'VE4GuHR9XJQ', 'LzzPKeMVe6j', 'Y1wNsABGXtK', 'z6FUVD7VcLI'
    ];

    constructor(d2) {
        makeAutoObservable(this, {
            d2: false,
        })
        this.d2 = d2
    }

    setLoading = (val) => (this.loading = val)
    setUserGroups = val => (this.userGroups = val)
    setUserGlobalStatus = (val) => (this.IsGlobalUser = val)
    setDefaultOrgUnit = (val) => (this.defaultOrgUnit = val)
    setUserOrgUnits = (val) => (this.userOrgUnits = val)
    setSearchOrgUnit = (val) => (this.searchOrgUnit = val)
    setDistricts = (val) => (this.districts = val)
    setCaseTypeHumanSelected = (val) => (this.caseTypeHumanSelected = val)
    setCaseTypeAnimalSelected = (val) => (this.caseTypeAnimalSelected = val)
    setCaseVerificationDeskSelected = (val) => (this.caseVerificationDeskSelected = val)
    setFilteringPeriod = (val) => (this.filteringPeriod = val)
    setFilteringOrgUnit = (val) => (this.filteringOrgUnit = val)
    setDaysDisabled = (val) => (this.daysDisabled = val)
    setMonthsDisabled = (val) => (this.monthsDisabled = val)
    setYearsDisabled = (val) => (this.yearsDisabled = val)
    setActiveSignalTabKey = (val) => (this.activeSignalTabKey = val)
    setActiveNewSignalTabKey = (val) => (this.activeNewSignalTabKey = val)
    setActiveForwardSignalTabKey = (val) => (this.activeForwardSignalTabKey = val)

    fetchDefaults = async () => {
        this.setLoading(true)
        const [orgUnits, userGroups] = await Promise.all(
            [this.d2.currentUser.getOrganisationUnits({ fields: 'id,name,level,parent[id,name]' }),
            this.d2.currentUser.getUserGroups({ fields: 'id,name' })
            ])
        this.setUserGroups(userGroups.toArray());

        const groupIDs = userGroups.toArray().map(g => g.id)
        /* compare with the global allowedUserGroups - if any usergroup exists in global*/
        const isGlobal = groupIDs.some((val) => this.allowedUserGroups.indexOf(val) !== -1)
        this.setUserGlobalStatus(isGlobal)

        if (orgUnits.toArray().length > 0) {
            console.log("===", orgUnits.toArray(), "--->")
            this.setDefaultOrgUnit(orgUnits.toArray()[0].id)
            // this.setUserOrgUnits(orgUnits.toArray().filter((ou)=> { 
            //     if (ou.level == 3) return {id: ou.id, name:ou.name}})).map((i)=> {return {id:i.id, displayName: i.name}})
            this.setFilteringOrgUnit(orgUnits.toArray()[0].id) /*just set this as filtering orgUnit*/
            this.setSearchOrgUnit(orgUnits.toArray()[0].id)
        }
        // console.log("===", orgUnits.toArray(), "--->", this.userOrgUnits)
        console.log("****>", orgUnits.toArray(), ".....", this.filteringOrgUnit)

        /*set districts */
        getInstance().then(d2 => {
            const api = d2.Api.getApi()
            const p = api.get("organisationUnits", {
                level: "3",
                fields: "id,displayName,parent[id,name,level]",
                paging: false
            })
            Promise.all([p]).then(
                (values) => {
                    // console.log(">>>>>>", values[0])
                    const { organisationUnits } = values[0]
                    this.setDistricts(organisationUnits)
                }
            )
            const q = api.get("me", {
                fields: "organisationUnits[id,name,displayName,level,parent[id,name],children[id,name,displayName,children[id,name,displayName]]]",
                paging: false
            })
            Promise.all([q]).then(
                (values) => {
                    const {organisationUnits} = values[0]
                    this.setUserOrgUnits(organisationUnits.filter((ou)=> { 
                        if (ou.level == 3) return {id: ou.id, name:ou.name}
                    })).map((i)=> {return {id:i.id, displayName: i.name}} )
                    if (organisationUnits !== undefined && organisationUnits.level === 1){
                        const national = [{
                            id: organisationUnits.id, 
                            displayName: organisationUnits.displayName,
                            name: organisationUnits.name
                        }]
                        this.setDistricts([...national, ...organisationUnits.children.children])
                    } else if (organisationUnits.level === 2){
                        this.setDistricts(organisationUnits.children)

                    } else if (organisationUnits.level ===3){
                        this.setDistricts(organisationUnits)
                    }
                    // this.setDistricts(organisationUnits)
                    // console.log("@@@@@@@@>", this.districts)
                }
            )
            const r = api.get(
                "organisationUnits", {
                    filter: "organisationUnitGroups.name:ilike:Kampala",
                    fields: "id,displayName,parent[id,name,level]", 
                    paging: false
                }
            )
            Promise.all([r]).then(
                (values) => {
                    const {organisationUnits} = values[0]
                    this.setDistricts([...this.districts, ...organisationUnits])
                    // console.log("@@@@@@@@", this.districts)
                }
            )

        }
        )

        this.setLoading(false)

    }

    fetchDistricts = async () => {
        getInstance().then(d2 => {
            const api = d2.Api.getApi()
            const p = api.get("organisationUnits", {
                level: "3",
                fields: "id,displayName",
                paging: false
            })
            Promise.all([p]).then(
                (values) => {
                    console.log(">>>>>>", values[0])
                    const { organisationUnits } = values[0]
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
                const p = api.post("events", eventPayload)
                Promise.all([p]).then((values) => {
                    console.log("Response After Saving:=>", values)
                })
                return {success: true, message: "Saved Successfully"}
            } catch {
                console.log("Error Saving Event: ", eventPayload)
                return {success: false, message: "Error Saving Event"}
            }
        })
    }

    fetchEvent = async (eventID) => {
        getInstance.then(d2 => {
            const api = d2.Api.getApi()
            const url = "events/" + eventID
            try {
                const { orgUnit, dataValues } = api.get(
                    url, { fields: "orgUnit,dataValues[dataElement,value]" })
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
    fetchChartData = async (dataDimension) => {
        const api = this.d2.Api.getApi();
        const data = await api.get(`analytics/events/aggregate/iaN1DovM5em?filter=pe:${this.filteringPeriod}&filter=ou:${this.filteringOrgUnit}&dimension=${dataDimension}`)
        return data;
    }

    fetchTotalMessages = async () => {
        const api = this.d2.Api.getApi();
        const dateString = ""
        var filterString = ""
        const dateToday = moment().format('YYYY-MM-DD')
        const dateTomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
        const thisWeekStart = moment().startOf('week').format('YYYY-MM-DD')
        const thisMonthStart = moment().subtract(0, 'month').startOf('month').format('YYYY-MM-DD')
        const thisYearStart = moment().subtract(0, 'year').startOf('year').format('YYYY-MM-DD')
        // use next day for THIS_WEEK
        switch (this.filteringPeriod) {
            case "TODAY":
                filterString = `filter=receiveddate:ge:${dateToday}&filter=text:ilike:Alert`
                break
            case "YESTERDAY":
                const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
                filterString = `filter=receiveddate:ge:${yesterday}&filter=receiveddate:lt:${dateToday}&filter=text:ilike:Alert`
                break
            case "LAST_WEEK":
                const lastWeekStart = moment().subtract(7, 'days').startOf('week').format('YYYY-MM-DD')
                filterString = `filter=receiveddate:ge:${lastWeekStart}&filter=receiveddate:lt:${thisWeekStart}&filter=text:ilike:Alert`
                break
            case "THIS_WEEK":
                // filterString = `filter=receiveddate:ge:${weekStart}&filter=receiveddate:le:${dateToday}&filter=text:ilike:Alert`
                filterString = `filter=receiveddate:ge:${thisWeekStart}&filter=text:ilike:Alert`
                break
            case "LAST_MONTH":
                const lastMonthStart = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                // const lastMonthEnd = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                filterString = `filter=receiveddate:ge:${lastMonthStart}&filter=receiveddate:lt:${thisMonthStart}&filter=text:ilike:Alert`
                break
            case "THIS_MONTH":
                filterString = `filter=receiveddate:ge:${thisMonthStart}&filter=receiveddate:lt:${dateTomorrow}&filter=text:ilike:Alert`
                break
            case "LAST_3_MONTHS":
                const last3MonthStart = moment().subtract(3, 'month').startOf('month').format('YYYY-MM-DD')
                filterString = `filter=receiveddate:ge:${last3MonthStart}&filter=text:ilike:Alert`
                break
            case "LAST_6_MONTHS":
                const last6MonthStart = moment().subtract(6, 'month').startOf('month').format('YYYY-MM-DD')
                filterString = `filter=receiveddate:ge:${last6MonthStart}`
                break
            case "LAST_YEAR":
                const lastYearStart = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
                filterString = `filter=receiveddate:ge:${lastYearStart}&filter=lastUpdate:lt:${thisYearStart}&filter=text:ilike:Alert`
                break
            case "THIS_YEAR":
                filterString = `filter=receiveddate:ge:${thisYearStart}&filter=receiveddate:lt:${dateTomorrow}&filter=text:ilike:Alert`
                break
            default:
                filterString = `filter=receiveddate:ge:${dateToday}&filter=text:ilike:Alert`

        }
        const data = await api.get(`sms/inbound?${filterString}&pageSize=1`)
        return data
    }

    fetchTotalAlerts = async () => {
        const api = this.d2.Api.getApi();
        const dateString = ""
        var filterString = ""
        const dateToday = moment().format('YYYY-MM-DD')
        switch (this.filteringPeriod) {
            case "TODAY":
                filterString = `startDate=${dateToday}`
                break
            case "YESTERDAY":
                const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
                filterString = `startDate=${yesterday}&endDate${dateToday}`
                break
            case "LAST_WEEK":
                const lastWeekStart = moment().subtract(7, 'days').startOf('week').format('YYYY-MM-DD')
                const lastWeekEnd = moment().subtract(7, 'days').endOf('week').format('YYYY-MM-DD')
                filterString = `startDate=${lastWeekStart}&endDate=${lastWeekEnd}`
                break
            case "THIS_WEEK":
                const weekStart = moment().startOf('week').format('YYYY-MM-DD')
                filterString = `startDate=${weekStart}&endDate=${dateToday}`
                break
            case "LAST_MONTH":
                const lastMonthStart = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
                const lastMonthEnd = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
                filterString = `startDate=${lastMonthStart}&endDate=${lastMonthEnd}`
                break
            case "THIS_MONTH":
                const thisMonthStart = moment().subtract(0, 'month').startOf('month').format('YYYY-MM-DD')
                filterString = `startDate=${thisMonthStart}&endDate=${dateToday}`
                break
            case "LAST_3_MONTHS":
                const last3MonthStart = moment().subtract(3, 'month').startOf('month').format('YYYY-MM-DD')
                filterString = `startDate=${last3MonthStart}&endDate=${dateToday}`
                break
            case "LAST_6_MONTHS":
                const last6MonthStart = moment().subtract(6, 'month').startOf('month').format('YYYY-MM-DD')
                filterString = `startDate=${last6MonthStart}&endDate=${dateToday}`
                break
            case "LAST_YEAR":
                const lastYearStart = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
                const lastYearEnd = moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD')
                filterString = `startDate=${lastYearStart}&endDate=${lastYearEnd}`
                break
            case "THIS_YEAR":
                const thisYearStart = moment().subtract(0, 'year').startOf('year').format('YYYY-MM-DD')
                filterString = `startDate=${thisYearStart}&endDate=${dateToday}`
                break
            default:
                filterString = `startDate=${dateToday}`

        }
        const data = await api.get(`events?program=iaN1DovM5em&orgUnit=${this.filteringOrgUnit}&${filterString}&totalPages=true&fields=event&pageSize=1&ouMode=DESCENDANTS`)
        return data
    }

}

export default Store;
