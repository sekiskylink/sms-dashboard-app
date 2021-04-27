import { PropTypes } from '@dhis2/prop-types'
import React, {useState, useEffect} from 'react'
import i18n from '@dhis2/d2-i18n'
import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableFoot,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'
import { Pagination } from './pagination/Pagination'
import {eventToMessage} from '../events'
import styles from './EventTable.module.css'

export const EventTable = ({
    events,
    pager,
    columns,
    rowRenderFn,
    userIsGlobal,
}) => {

    return (
        <Table>
            <TableHead>
                <TableRowHead>
                    {columns.map(column => (
                        <TableCellHead key={column}>{column}</TableCellHead>
                    ))}
                </TableRowHead>
            </TableHead>
            <TableBody>
                {events.length === 0 ? (
                    <TableRow>
                        <TableCell
                            colSpan={String(columns.length)}
                            className={styles.noResults}
                        >
                            {i18n.t('No SMSes to display')}
                        </TableCell>
                    </TableRow>
                ) :  (
                    events.map(event => {
                        return (
                            <TableRow key={event.event}>
                                {rowRenderFn(eventToMessage(event), event, userIsGlobal)}
                            </TableRow>
                        )
                    }) 
                    )
                }
            </TableBody>
            <TableFoot>
                <TableRow>
                    <TableCell colSpan={String(columns.length)}>
                        <Pagination {...pager} />
                    </TableCell>
                </TableRow>
            </TableFoot>
        </Table>
    )
}

EventTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    pager: PropTypes.PropTypes.object.isRequired,
    rowRenderFn: PropTypes.func.isRequired,
    userIsGlobal: PropTypes.PropTypes.bool
}
