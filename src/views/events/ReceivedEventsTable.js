import { PropTypes } from '@dhis2/prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { TableCell, Button } from '@dhis2/ui'
import { Date, Time } from '../../time'
// import { EventDialog } from '../../events'
import { EventDialog } from './EventDialog'
import { EventTable } from '../../event_table/EventTable'
import styles from './ReceivedEventsTable.module.css'

export const ReceivedEventsTable = ({
    events,
    pager,
    refetchFn
}) => (
    <EventTable
        events={events}
        pager={pager}
        columns={[
            i18n.t('Message'),
            i18n.t('Phone number'),
            i18n.t('Received'),
            i18n.t('Staus'),
            i18n.t('Action')
        ]}
        rowRenderFn={(message, event) => (
            <>
                <TableCell>
                    {message.text}
                </TableCell>
                <TableCell>
                    <span className={styles.originator}>
                        {message.phone}
                    </span>
                </TableCell>
                <TableCell>
                    <Date date={message.receiveddate} />
                    {', '}
                    <br />
                    <Time time={message.receiveddate} />
                </TableCell>
                <TableCell>
                    {message.status}
                </TableCell>
                <TableCell>
                    <EventDialog message={message} event={event} refetchFn={refetchFn} />
                </TableCell>
            </>
        )}
    />
)

ReceivedEventsTable.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    pager: PropTypes.PropTypes.object.isRequired,
    refetchFn: PropTypes.func
}
