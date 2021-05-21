import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { PropTypes } from '@dhis2/prop-types'
import i18n from '@dhis2/d2-i18n'
import debounce from 'lodash.debounce'
import { dataTest } from '../../dataTest'
import {
    Button,
    Select
} from 'antd'
import { useQueryParams } from './useQueryParams'
import { createSearchString } from '../../utils'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../context/context'
import { eventConfs } from '../../events'
import styles from './Filter.module.css'

const { Option } = Select;

const DistrictFieldSelect = observer(() => {
    const store = useStore()
    const history = useHistory()
    const { pageSize, orgUnit } = useQueryParams(store.searchOrgUnit)

    const handleOrgUnitChange = (selected) => {
        console.log("Selected District is", selected)
        store.setSearchOrgUnit(selected)
        history.push({
            search: createSearchString({
                orgUnit: selected,
                pageSize,
                page: 1,
            }),
        })
    }

    const districtsOptions = store.districts.map((d) => (
        <Option key={d.id} label={d.displayName} value={d.id}>{d.displayName}</Option>))
    return (
        <Select
            label={i18n.t('Filter by District')}
            style={{ width: "250px" }}
            onChange={handleOrgUnitChange}
            placeholder={"Select District"}
            size={"large"}
            className={styles.filter}
        >
            {store.IsGlobalUser ?
                <Option key={eventConfs.nationalOrgUnit}
                    value={eventConfs.nationalOrgUnit} label={"National"}>National
                </Option> :
                <Option key={store.defaultOrgUnit}
                    value={store.defaultOrgUnit} label={"My OrganisationUnit"}>My OrganisationUnit
                </Option>
            }

            {store.IsGlobalUser &&
                districtsOptions
            }

        </Select>
    )

})

const Filter = observer(() => {
    const store = useStore()
    const { pageSize, orgUnit } = useQueryParams(store.searchOrgUnit)
    const history = useHistory()

    const handleReset = () => {
        history.push({
            search: createSearchString({
                pageSize,
                page: 1,
            }),
        })
    }

    return (
        <div
            data-test={dataTest('views-events-filter')}
            className={styles.container}
        >
            <div className={styles.inputStrip}>
                <DistrictFieldSelect />
                {/* <Button large onClick={handleReset} dataTest="reset-filter-btn">
                    {i18n.t('Reset filter')}
                </Button> */}
                <Button onClick={handleReset} size={"large"}>
                    {i18n.t('Reset filter')}
                </Button>
            </div>
        </div>
    )
})

export { Filter }
