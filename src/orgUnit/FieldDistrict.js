import { Select } from 'antd'
import React, {useState} from 'react'
import propTypes from 'prop-types'

import i18n from '../locales'
import { useReadOrgUnitsQuery } from './useReadOrgUnitsQuery'

const {Option} = Select;

export const FieldDistrict = ({form, name, value}) => {
    const [selected, setSelected] = useState(value)
    const { loading, error, data } = useReadOrgUnitsQuery()
    if(loading){
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
    const {organisationUnits} = data.orgUnits
    return (
        <Select 
            showSearch
            mode="single"
            placeholder={i18n.t('Districts')} 
            value={selected}
            onChange= {(value) => {
                const fields = form.getFieldsValue()
                fields[name] = value
                form.setFieldsValue(fields)
                setSelected(value)
                console.log("New Value=>", value,  ">>>>", fields)
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

FieldDistrict.propTypes = {
    name: propTypes.string.isRequired,
    value: propTypes.string
}
