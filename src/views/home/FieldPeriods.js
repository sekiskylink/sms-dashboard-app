import { Select } from 'antd'
import { useEffect, useRef, useState } from 'react'
import i18n from '../../locales'
import { useStore } from '../../context/context'
import { observer } from 'mobx-react-lite'

const { Option } = Select;

export const FieldPeriods = observer(() => {
    const store = useStore()

    const handleChange = (value) => {
        store.setFilteringPeriod(value)
        console.log("Period Selected = ", value)
    }

    return (
        <>
            <Select
                showSearch
                placeholder={i18n.t('Select Period')}
                onChange={handleChange}
                value={store.filteringPeriod}
                // defaultValue={["THIS_WEEK"]}
                autoClearSearchValue={false}
                style={{ width: "80%", display: 'flex', color: "#000", background: "#009966" }}
            >
                <Option key="TODAY" value="TODAY">Today</Option>
                <Option key="YESTERDAY" value="YESTERDAY">Yesterday</Option>
                <Option key="thisweek" value="THIS_WEEK">This Week</Option>
                <Option key="lastweek" value="LAST_WEEK">Last Week</Option>
                <Option key="thismonth" value="THIS_MONTH">This Month</Option>
                <Option key="lastmonth" value="LAST_MONTH">Last Month</Option>
                <Option key="last3month" value="LAST_3_MONTHS">Last 3 Months</Option>
                <Option key="last6month" value="LAST_6_MONTHS">Last 6 Months</Option>
                <Option key="thisyear" value="THIS_YEAR">This Year</Option>
                <Option key="lastyear" value="LAST_YEAR">Last Year</Option>
            </Select>
        </>
    )
})