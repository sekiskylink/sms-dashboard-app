import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { useDataQuery } from '@dhis2/app-runtime'
import { useStore } from '../context/context'
import { observer } from 'mobx-react-lite'

export const PieChart = observer(({ title, dataDimension }) => {
    const store = useStore()
    const [data, setData] = useState()

    useEffect(() => {
        store.fetchChartData(dataDimension).then((data) => setData(data))
    }, [store.filteringPeriod, store.filteringOrgUnit])

    var layout = {
        width: 520,
        height: 400,
        title: title ? title : ''
    }
    return (
        <div>
            {!!data &&
                <div>
                    {data.rows.length > 0 ?
                        <Plot
                            data={[
                                {
                                    values: data.rows.map((r) => r[1]),
                                    labels: data.rows.map((r) => r[0]),
                                    type: 'pie',
                                    name: 'SMS Status',
                                    // marker: {color: 'red'},
                                },
                            ]}
                            layout={layout} /> : <div>No data</div>
                    }
                </div>
            }
        </div>
    )
})