import { Select } from 'antd'
import React, {useState, useEffect} from 'react'
import propTypes from 'prop-types'

import i18n from '../locales'
import { useReadOptionSetQuery } from './useReadOptionSetQuery'

const {Option} = Select;

export const FieldOptionSet = ({id, form, name, placeholder, value}) => {
    const [selected, setSelected] = useState(value)
    const { loading, error, data } = useReadOptionSetQuery(id)
    if(loading){
        return (
            <Select placeholder={i18n.t(placeholder)} value={value}>

            </Select>
        )
    }

    if (error) {
        return (
            <Select placeholder={i18n.t(placeholder)} value={value}>
            </Select>
        )
    }

    const { options } = data.optionSets

    return (
        <Select 
            showSearch
            placeholder={i18n.t(placeholder)} 
            value={selected}
            onChange={(value) => {
                const fields = form.getFieldsValue()
                fields[name] = value
                form.setFieldsValue(fields)
                setSelected(value)
                // console.log("New ", name, ": =>", value,  ">>>>", fields)
                }
            }
        >
            {
                options.map((op) => (
                    <Option key={op.id} value={op.code}>
                        {op.name}
                    </Option>
                ))
            }
        </Select>
    )
}

FieldOptionSet.propTypes = {
    id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    placeholder: propTypes.string,
    value: propTypes.string
}
