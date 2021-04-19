import { Select } from 'antd'
import React, {useState} from 'react'
import propTypes from 'prop-types'

import i18n from '../locales'
import { useReadUserGroupsQuery } from '../userGroup/useReadUserGroupsQuery'

const {Option} = Select;

export const FieldUserGroup = ({name, form}) => {
    const [selectedGroups, setSelectedGroups] = useState([])
    const { loading, error, data } = useReadUserGroupsQuery()
    if(loading){
        return (
            <Select placeholder={i18n.t("Please Select")}>

            </Select>
        )
    }

    if (error) {
        return (
            <Select placeholder={i18n.t("Please Select")}>
            </Select>
        )
    }
    console.log("userGroups =>", data)
    const { userGroups } = data.userGroups
    return (
        <Select 
            showSearch
            mode="multiple"
            style={{ width: "100%" }}
            placeholder={i18n.t("Please Select")}
            value={ selectedGroups }
            onChange={ value => {
                const fields = form.getFieldsValue()
                fields[name] = value
                form.setFieldsValue(fields)
                setSelectedGroups(value)
                console.log("New Notify Users:", value,  ">>>>", fields)
                } 
            }
            filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
              }}
        >
            {
                userGroups.map((g) => (
                    <Option key={g.id} value={g.code}>
                        {g.displayName}
                    </Option>
                ))
            }
        </Select>
    )
}
FieldUserGroup.propTypes = {
    name: propTypes.string.isRequired,
}
