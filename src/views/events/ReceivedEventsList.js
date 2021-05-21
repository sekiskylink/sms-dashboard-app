import { NoticeBox, CenteredContent, CircularLoader } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import React, { useEffect } from 'react'
import { useQueryParams } from './useQueryParams'
import { PageHeadline } from '../../headline'
import { dataTest } from '../../dataTest'
import i18n from '../../locales'
// import { Filter } from './Filter'
import { Filter } from './DistrictFilter'
import { ReceivedEventsTable } from './ReceivedEventsTable'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../context/context'
import {
    eventConfs,
} from '../../events'

import styles from './ReceivedEventsList.module.css'
import { NewEventDialog } from './NewEventDialog'

export const RECEIVED_ALERTS_LABEL = i18n.t('Alerts')
export const RECEIVED_ALERTS_PATH = '/alerts'

const parseParams = ({ page, pageSize, orgUnit }) => {
    const params = {
        page,
        pageSize,
        totalPages: true,
        fields: [
            'event',
            'orgUnit',
            'created',
            'dataValues[lastUpdated,dataElement,value]'
        ],
        order: 'created:desc',
        ouMode: 'DESCENDANTS',
        orgUnit
    }
    params.program = eventConfs.program

    const filters = []

    if (filters.length > 0) {
        params.filter = filters
    }

    return params
}

const query = {
    events: {
        resource: 'events',
        params: parseParams,
    },
}

export const ReceivedEventsList = observer(() => {
    const store = useStore()
    const { page, pageSize, orgUnit } = useQueryParams(store.searchOrgUnit)
    const { called, loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    const refetchAndClear = () => {
        refetch()
    }

    useEffect(() => {
        refetch({ page, pageSize, orgUnit })
    }, [page, pageSize, store.searchOrgUnit])



    if (error) {
        const msg = i18n.t('Something went wrong whilst loading received Alerts')

        return (
            <>
                <PageHeadline>{RECEIVED_ALERTS_LABEL}</PageHeadline>
                <NoticeBox error title={msg}>
                    {error.message}
                </NoticeBox>
            </>
        )
    }

    const events = data?.events?.events || []
    console.log("EVENTS::==>", events)

    return (
        <div
            data-test={dataTest('views-receivedalertslist')}
            className={styles.container}
        >
            <PageHeadline>{RECEIVED_ALERTS_LABEL}</PageHeadline>

            <header className={styles.header}>

                {store.IsGlobalUser &&
                    <Filter />
                }
                <NewEventDialog refetchFn={refetchAndClear} />

            </header>

            {loading || !called ? (
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            ) : (
                <ReceivedEventsTable
                    events={events}
                    pager={data.events.pager}
                    userIsGlobal={store.IsGlobalUser}
                    refetchFn={refetchAndClear}
                />
            )}
        </div>
    )
})
