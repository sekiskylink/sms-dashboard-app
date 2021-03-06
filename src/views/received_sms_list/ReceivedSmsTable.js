import { PropTypes } from '@dhis2/prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { TableCell, Button } from '@dhis2/ui'
import { Date, Time } from '../../time'
import { EventDialog, EventExists, EventModalButton } from '../../events'
import { statusMap } from './translations'
import { SmsTable } from '../../sms_table/SmsTable'
import styles from './ReceivedSmsTable.module.css'

export const ReceivedSmsTable = ({
    messages,
    pager,
    selectedIds,
    setSelectedIds,
    refetchFn
}) => (
    <SmsTable
        messages={messages}
        pager={pager}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        columns={[
            i18n.t('Message'),
            i18n.t('Phone number'),
            // i18n.t('Status'),
            // i18n.t('Sender'),
            i18n.t('Received'),
            i18n.t('Action')
        ]}
        rowRenderFn={message => (
            <>
                <TableCell>
                    <EventExists id={message.id} />
                    {message.text}
                </TableCell>
                <TableCell>
                    <span className={styles.originator}>
                        {message.originator}
                    </span>
                </TableCell>
                {/*
                <TableCell>{statusMap[message.smsstatus]}</TableCell>
                <TableCell>
                    {message.user?.userCredentials?.username ||
                        i18n.t('Unknown')}
                </TableCell>
                    */}
                <TableCell>
                    <Date date={message.receiveddate} />
                    {', '}
                    <br />
                    <Time time={message.receiveddate} />
                </TableCell>
                {/* DialogForm for Updates goes here*/}
                <TableCell>
                    {/* <EventDialog message={message} /> */}
                    <EventModalButton message={message} refetchFn={refetchFn} />
                </TableCell>
            </>
        )}
    />
)

ReceivedSmsTable.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.object).isRequired,
    pager: PropTypes.PropTypes.object.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    setSelectedIds: PropTypes.func.isRequired,
    refetchFn: PropTypes.func
}
