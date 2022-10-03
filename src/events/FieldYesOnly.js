import { Checkbox } from 'antd'
import React, {useState, useEffect} from 'react'
import propTypes from 'prop-types'

import i18n from '../locales'


export const FieldYesOnly = ({form, name, defaultVal}) => {
    console.log("Name: ", name, " ", defaultVal)
    const [checked, setChecked] = useState(defaultVal ? true: false);


    return (
        <Checkbox 
            checked={checked}
            onChange={(value) => {
                const fields = form.getFieldsValue()
                fields[name] = value.target.checked ? true : ""
                form.setFieldsValue(fields)
                setChecked(value.target.checked)
                console.log("New ", name, ": =>", value.target.checked,  ">>>>", fields, "---", defaultVal)
                }
            }
        >
        </Checkbox>
    )
}

FieldYesOnly.propTypes = {
    name: propTypes.string.isRequired,
    defaultVal: propTypes.bool
}
