import React from 'react'
import { Card } from '@dhis2/ui'
import {Form, Row, Col, Select} from 'antd'
import { FieldDistrict } from '../../orgUnit/FieldDistrict'
import { PropTypes } from '@dhis2/prop-types'
import s from './HomeCard.module.css'

const {Option} = Select

const VisualisationCard = ({  }) => {
    const [form] = Form.useForm()
    return (
        <Card>
        <div className={s.container}>
        <h3 className={s.title}>Select Visualization Details</h3>
            <Form form={form}>
                <Row>
                    <Col span={24}>
                        <Form.Item name="district" label="District">
                            <FieldDistrict name="district" form={form}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item name="reportby" label=" Metric">
                            <Select placeholder="Report By">
                                <Option key="actionTaken" value="actionTaken">Action Taken</Option>
                                <Option key="followupAction" value="followupAction">FollowUp Action</Option>
                                <Option key="status" value="status">SMS Status</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
        </Card>
    )
}
/*
HomeCard.propTypes = {
    bodyText: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    titleText: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
}
*/

export default VisualisationCard