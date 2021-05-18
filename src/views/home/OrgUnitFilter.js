import { Select } from 'antd'
import React, { useState } from 'react'
import propTypes from 'prop-types'

import i18n from '../../locales'
import { useReadOrgUnitsQuery } from '../../orgUnit/useReadOrgUnitsQuery'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../context/context'
import { eventConfs } from '../../events'

const { Option } = Select;

export const OrgUnitFilter = observer(({ name }) => {
    const [selected, setSelected] = useState()
    const { loading, error, data } = useReadOrgUnitsQuery()
    const store = useStore()
    if (loading) {
        return (
            <Select placeholder={i18n.t('Select District')}
                style={{ width: 250, color: "#000", background: "#009966" }}
            >

            </Select>
        )
    }

    if (error) {
        return (
            <Select placeholder={i18n.t('Select District')}
                style={{ width: 250, color: "#000", background: "#009966" }}
            >
            </Select>
        )
    }
    const onChange = (value) => {
        store.setFilteringOrgUnit(value)
        setSelected(value)
        console.log("Orgunit Selected = ", value)
    }
    const { organisationUnits } = data.orgUnits
    return (
        <Select
            showSearch
            mode="single"
            placeholder={i18n.t('Organisation Unit')}
            value={selected}
            onChange={onChange}
            style={{ width: 250, color: "#000", background: "#009966" }}
            filterOption={(input, option) => {
                return (
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                    option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            }}
        >
            {store.IsGlobalUser &&
                <Option key={eventConfs.nationalOrgUnit} value={eventConfs.nationalOrgUnit}>National</Option>
            }
            {
                organisationUnits.map((d) => (
                    <Option key={d.id} value={d.id}>
                        {d.displayName}
                    </Option>
                ))
            }
        </Select>
    )
})

OrgUnitFilter.propTypes = {
    name: propTypes.string,
}