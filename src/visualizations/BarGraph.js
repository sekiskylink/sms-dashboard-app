import React, { useEffect, useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import Plot from 'react-plotly.js';
import { useStore } from '../context/context'
import { observer } from 'mobx-react-lite'

export const BarGraph = observer(({ title, dataDimension }) => {

    const store = useStore()

    const [data, setData] = useState()

    useEffect(() => {
        store.fetchChartData(dataDimension).then((data) => setData(data))
    }, [store.filteringPeriod])


    var layout = {
        barmode: "stack",
        width: 605,
        height: 400,
        title: title ? title : "",

    }

    return (
        <div>
            {!!data &&
                <div>
                    {data.rows.length > 0 ?
                        <Plot
                            data={[
                                {
                                    x: data.rows.map((r) => r[0]),
                                    y: data.rows.map((r) => r[1]),
                                    type: 'bar',
                                    name: title ? title : "",
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