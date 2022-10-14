import { Select } from 'antd'
import React, { useState } from 'react'
import propTypes from 'prop-types'

import i18n from '../locales'
import { useReadMeQuery } from './useReadMeQuery'
import { useReadOrgUnitsQuery } from './useReadOrgUnitsQuery'
import { observer} from 'mobx-react-lite'
import {useStore} from '../context/context'

const { Option } = Select;

export const FieldDistrict2 = observer(({ form, name, value }) => {
    const [selected, setSelected] = useState(value)
    const store = useStore()
    if (store.IsGlobalUser){
        console.log("User is Global!!!!")
        const { loading, error, data } = useReadOrgUnitsQuery()
        if (loading) {
            return (
                <Select placeholder={i18n.t('District')}>
    
                </Select>
            )
        }
    
        if (error) {
            return (
                <Select placeholder={i18n.t('District')}>
                </Select>
            )
        }
        const { organisationUnits } = data.orgUnits
        
        return (
            <Select
                showSearch
                mode="single"
                placeholder={i18n.t('Districts')}
                value={selected}
                onChange={(value) => {
                    const fields = form.getFieldsValue()
                    fields[name] = value
                    form.setFieldsValue(fields)
                    setSelected(value)
                    console.log("New Value=>", value, ">>>>", fields)
                }}
                filterOption={(input, option) => {
                    return (
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                        option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                }}
            >
                {
                    organisationUnits.map((d) => (
                        <Option key={d.id} value={d.id}>
                            {d.displayName}
                        </Option>
                    ))
                }
            </Select>
        )
    } else {
        console.log("User is NOT Global!!!!")
        const { loading, error, data } = useReadMeQuery()
        if (loading) {
            return (
                <Select placeholder={i18n.t('District')}>
    
                </Select>
            )
        }
    
        if (error) {
            return (
                <Select placeholder={i18n.t('District')}>
                </Select>
            )
        }
        const { organisationUnits } = data.me
        
        return (
            <Select
                showSearch
                mode="single"
                placeholder={i18n.t('Districts')}
                value={selected}
                onChange={(value) => {
                    const fields = form.getFieldsValue()
                    fields[name] = value
                    form.setFieldsValue(fields)
                    setSelected(value)
                    console.log("New Value=>", value, ">>>>", fields)
                }}
                filterOption={(input, option) => {
                    return (
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                        option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    );
                }}
            >
                {
                    organisationUnits.map((d) => (
                        <Option key={d.id} value={d.id}>
                            {d.displayName}
                        </Option>
                    ))
                }
            </Select>
        )
    }
})

FieldDistrict2.propTypes = {
    name: propTypes.string.isRequired,
    value: propTypes.string
}
