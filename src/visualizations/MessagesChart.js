import React, { useEffect, useState } from 'react'
import Plot from 'react-plotly.js'
import { useDataQuery } from '@dhis2/app-runtime'
import { useStore } from '../context/context'
import { observer } from 'mobx-react-lite'

export const MessagesChart = observer(({ title }) => {
    const store = useStore()
    const [data, setData] = useState()

    useEffect(() => {
        store.fetchTotalMessages().then((data) => setData(data))
    }, [store.filteringPeriod])

    var layout = {
        width: 250,
        height: 150,
        title: title ? title : "",

    }

    return (
        <div>
            {!!data &&
                <div>
                    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                    {
                        <Plot
                            data={[
                                {

                                    type: 'indicator',
                                    name: title ? title : "",
                                    value: data.pager.total,
                                    number: { font: { size: 60 } }
                                },
                            ]}
                            layout={layout}
                        />
                    }
                </div>
            }
        </div>
    )
})