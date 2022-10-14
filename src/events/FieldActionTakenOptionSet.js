import { Select } from 'antd'
import React, {useState, useEffect} from 'react'
import propTypes from 'prop-types'

import i18n from '../locales'
import { useReadOptionSetQuery } from './useReadOptionSetQuery'
import {useStore} from '../context/context'
import { observer } from 'mobx-react-lite'

const {Option} = Select;

export const FieldActionTakenOptionSet = observer(({id, form, name, placeholder, value, identifier}) => {
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
                
                    const fields = form.getFieldsValue()
                    fields[name] = value
                    form.setFieldsValue(fields)

                    const event = fields["event"]
                    console.log("New ", name, ": =>", value,  ">>>>", fields)
                    switch (value) {
                        case 'Case Verification Desk':
                            if (identifier === 'newEvent'){
                                store.setActiveNewSignalTabKey(`newCaseVerification`)
                                // console.log("Action Taken is:::: ", store.activeSignalTabKey, "===>", identifier)

                            } else if (identifier === 'forwardEvent'){
                                store.setActiveForwardSignalTabKey(`forward-caseVerification-${event}`)
                                // console.log("Action Taken is:::: ", store.activeSignalTabKey)
                            } else {
                                store.setActiveSignalTabKey(`caseVerification-${event}`)

                            }
                            break
                        default:
                            // console.log("Action Taken is", value)
                            store.setCaseVerificationDeskSelected(false)
                    }

                    setSelected(value)
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

FieldActionTakenOptionSet.propTypes = {
    id: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    identifier: propTypes.string,
    placeholder: propTypes.string,
    value: propTypes.string
}