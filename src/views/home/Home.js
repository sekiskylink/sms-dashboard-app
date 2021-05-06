import React, { useEffect } from 'react'
import i18n from '../../locales'
import { PageHeadline } from '../../headline'
import { dataTest } from '../../dataTest'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../context/context'
import s from './Home.module.css'
import { Card } from '@dhis2/ui'
import { Row, Col, Space, Form } from 'antd'
import { PieChart } from '../../visualizations'
import { BarGraph } from '../../visualizations'
import { MessagesChart } from '../../visualizations'
import { AlertsChart } from '../../visualizations'
import { FieldPeriods } from './FieldPeriods'

export const HOME_PATH = '/'
export const HOME_LABEL = 'Dashboard'

export const Home = observer(() => {
    const store = useStore()
    return (
        <div data-test={dataTest('views-home')}>
            <PageHeadline>
                {i18n.t('Dashboard', {
                    nsSeparator: '>',
                })}
            </PageHeadline>
            <p className={s.explanation}>
                {i18n.t(
                    'View quick statistics and also make custom filters for visualisations'
                )}
            </p>
            {/* */}
            <Row>
                <Col span={6}>
                    Period Filter: <FieldPeriods />
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Space direction="vertical" size="large">
                        <br />
                    </Space>
                </Col>
            </Row>
            <Row>
                {store.IsGlobalUser &&
                    <Col span={12}>
                        <MessagesChart title="Total Messages Received" />
                    </Col>
                }
                <Col span={12}>
                    <AlertsChart title="Total Alerts" />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <PieChart title="SMS Status" dataDimension="nFNdf8wcGNu" />
                </Col>
                <Col span={12}>
                    <BarGraph title="Action Taken" dataDimension="Y9ahw4POban" />
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <BarGraph title="Followup Action" dataDimension="ER1Z7hl3loe" />
                </Col>
                <Col span={12}>
                    <BarGraph title="Suspected Disease" dataDimension="elGqdsbgahz" />
                </Col>
            </Row>

        </div>
    )
})
