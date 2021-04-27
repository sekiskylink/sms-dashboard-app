import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { PropTypes } from '@dhis2/prop-types'
import i18n from '@dhis2/d2-i18n'
import debounce from 'lodash.debounce'
import { dataTest } from '../../dataTest'
import {
    Button,
    SingleSelectField,
    SingleSelectOption,
} from '@dhis2/ui'
import { useQueryParams } from './useQueryParams'
import { useReadOrgUnitsQuery } from '../../orgUnit'
import { createSearchString } from '../../utils'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../context/context'
import styles from './Filter.module.css'

const DistrictFieldSelect = observer(() => {
    const store = useStore()
    const handleOrgUnitChange = ({ selected }) => {
        history.push({
            search: createSearchString({
                orgUnit: selected,
                pageSize,
                page: 1,
            }),
        })
    }
    
    console.log("VVVVVVVVVV", store.defaultOrgUnit)
    return (
        <SingleSelectField
            label={i18n.t('Filter by District')}
            inputWidth="200px"
            onChange={handleOrgUnitChange}
            //selected={}
            dataTest="orgunit-filter"
        >
            {
                store.districts.map((org) => {
                    <SingleSelectOption
                        key={org.id}
                        label={org.displayName}
                        value={org.id}
                    /> 
                })
            }
                    
        </SingleSelectField>
    )
    
})

const Filter = observer(() => {
    const store = useStore()
    const { pageSize, orgUnit } = useQueryParams(store.defaultOrgUnit)
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
                <DistrictFieldSelect/>
                <Button large onClick={handleReset} dataTest="reset-filter-btn">
                    {i18n.t('Reset filter')}
                </Button>
            </div>
        </div>
    )
})

export { Filter }
