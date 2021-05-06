import { Select } from 'antd'
import React, {useState, useEffect} from 'react'
import propTypes from 'prop-types'

import i18n from '../locales'
import { useReadOptionSetQuery } from './useReadOptionSetQuery'
import {useStore} from '../context/context'
import { observer } from 'mobx-react-lite'

const {Option} = Select;

export const FieldCaseTypeOptionSet = observer(({id, form, name, placeholder, value}) => {
    const [selected, setSelected] = useState(value)
    const store = useStore()
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
                
                switch (value) {
                    case 'Human': 
                        store.setCaseTypeAnimalSelected(false)
                        store.setCaseTypeHumanSelected(true)
                        break
                    case 'Animal':
                        store.setCaseTypeHumanSelected(false)
                        store.setCaseTypeAnimalSelected(true)
                        break
                    default:
                        store.setCaseTypeHumanSelected(false)
                        store.setCaseTypeAnimalSelected(false)
                }

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
})

FieldCaseTypeOptionSet.propTypes = {
    id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    placeholder: propTypes.string,
    value: propTypes.string
}
