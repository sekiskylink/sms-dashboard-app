import { Select } from 'antd'
import React, {useState, useEffect} from 'react'
import propTypes from 'prop-types'

import i18n from '../locales'
import { useReadOptionSetQuery } from './useReadOptionSetQuery'

const {Option} = Select;

export const FieldYesNo = ({form, name, placeholder, value}) => {
    const [selected, setSelected] = useState(value)

    const options = [{id: "yes", code: "Yes"}, {id: "no", code: "No"}]

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

FieldYesNo.propTypes = {
    name: propTypes.string.isRequired,
    placeholder: propTypes.string,
    value: propTypes.string
}
