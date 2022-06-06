import { PropTypes } from '@dhis2/prop-types'
import React, { useState } from 'react'
import moment from 'moment';
import { Modal, Form, Button, Input, InputNumber, DatePicker, Space, Row, Col } from 'antd'
import { FieldDistrict } from '../../orgUnit/FieldDistrict'
import { FieldOptionSet } from '../../events/FieldOptionSet'
import { FieldStatusOptionSet } from '../../events/FieldStatusOptionSet'
import { FieldUserGroup } from '../../events/FieldUserGroup'
import { FieldCaseTypeOptionSet } from '../../events/FieldCaseTypeOptionSet'
import {
    eventToMessage,
    eventConfs,
    saveEvent,
} from '../../events'
import { observer } from "mobx-react-lite"
import { useStore } from '../../context/context'

import i18n from '../../locales'
import { FieldAgev2 } from '../../events/FieldAgev2';

const FormItem = Form.Item;
const TextArea = Input.TextArea

export const EventDialog = observer(({ message, event, refetchFn }) => {
    const store = useStore()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentEventValues, setCurrentEventValues] = useState({})
    const [modalTitle, setModleTitle] = useState("Create Alert Event")
    const [selectedGroups, setSelectedGroups] = useState([])

    const showModal = () => {
        console.log("MESSAGE", message)
        const cValues = eventToMessage(event)
        // console.log("eventFromMessage", cValues)
        setCurrentEventValues(cValues)
        if ('district' in cValues) {
            setModleTitle("Update Signal Event")
        }
        switch (cValues['eventType']) {
            case 'Human':
                store.setCaseTypeHumanSelected(true)
                break
            case 'Animal':
                store.setCaseTypeAnimalSelected(true)
                break
            default:
                store.setCaseTypeHumanSelected(false)
                store.setCaseTypeAnimalSelected(false)
        }
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const getInitialValue = (field) => {
        if (field in currentEventValues) {
            return currentEventValues[field]
        }
        return "";
    }

    const handleOk = async (values) => {
        console.log("submited values", values)

        // Prepare to create or update event
        const completeDate = new Date().toISOString().slice(0, 10);
        var toCompleteEvent = false
        var assignToNationalLevel = false
        var age = undefined
        let dataValues = [];
        for (let i in values) {
            switch (i) {
                case 'followupDate':
                    if (values[i] instanceof Object) {
                        dataValues.push({
                            dataElement: eventConfs[i],
                            value: values[i].format("YYYY-MM-DD")
                        })
                    }
                    break
                case 'dateOfOnset':
                    if (values[i] && values[i] instanceof Object) {
                        dataValues.push({
                            dataElement: eventConfs[i],
                            value: values[i].format("YYYY-MM-DD")
                        })
                    }
                    break
                case 'actionTaken':
                    if (values[i] && values[i].length > 0) {
                        /*We only complet event if Action taken is present*/
                        toCompleteEvent = true
                        dataValues.push({ dataElement: eventConfs[i], value: values[i] })
                    }
                    break
                case 'age':
                    // age = values[i] && Object.keys(values[i]).length > 0 && values[i].age ?
                    //     values[i].age.format("YYYY-MM-DD") : ""
                    // if (age !== "" && age !== undefined) {
                    //     dataValues.push({ dataElement: eventConfs[i], value: age })
                    // }
                    if (values[i] && Object.keys(values[i]).length > 0) {
                        if (!!values[i].years){
                            dataValues.push({ dataElement: eventConfs['years'], value: values[i].years })
                        }
                        if (!!values[i].months) {
                            dataValues.push({ dataElement: eventConfs['months'], value: values[i].months })

                        }
                        if (!!values[i].days){

                            dataValues.push({ dataElement: eventConfs['days'], value: values[i].days })
                        }
                    }
                    break
                case 'status':
                    if (values[i] === "unactionable") {
                        /* Assign unactionabel events to National level */
                        assignToNationalLevel = true
                    }
                    dataValues.push({ dataElement: eventConfs[i], value: values[i] })
                    break
                default:
                    if ((i in eventConfs) && values[i] && values[i].length > 0) {
                        dataValues.push({ dataElement: eventConfs[i], value: values[i] })

                    }
            }

        }
        const eventPayload = {
            event: values["event"],
            program: eventConfs["program"],
            orgUnit: values["district"],
            // eventDate: values["alertDate"]["_d"].toISOString().slice(0, 10),
            eventDate: values["alertDate"],
            // status: "COMPLETED",
            // completeDate: completeDate,
            // storedBy: '',
            dataValues: dataValues
        }

        if (toCompleteEvent) {
            eventPayload['status'] = "COMPLETED"
            eventPayload['CompleteDate'] = completeDate
        }
        if (assignToNationalLevel) {
            eventPayload['orgUnit'] = eventConfs["nationalOrgUnit"]
        }
        console.log(JSON.stringify(eventPayload));
        saveEvent(eventPayload).then((value) => {
            if (value) {
                refetchFn()
            }
        })
        setIsModalVisible(false);
    }
    const [form] = Form.useForm();

    // const alertDate = moment(message.receiveddate, moment.HTML5_FMT.DATE);
    const alertDate = moment(message.receiveddate);
    console.log("Alert Date=>", alertDate, "Received Date", message.receiveddate)

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    }

    const yearsChange = (value) => {
        console.log("Value:", value)
        return value
    }

    return (
        <>
            <Button type="default" onClick={showModal}>
                {i18n.t('Update Signal')}
            </Button>

            <Modal title={modalTitle} visible={isModalVisible}
                onOk={form.submit} onCancel={handleCancel} okText="Update"
                confirmLoading={false} width="80%">
                <Space direction="vertical"></Space>
                {/* <p style={{ textAlign: "left" }}> Msg: {message.text}</p> */}
                <Row>
                    <Col span={4}>
                        <p style={{ textAlign: "left" }}>From: {message.phone}</p>
                    </Col>
                    <Col span={20}>
                        <p style={{ textAlign: "left" }}>Msg: {message.text} </p>
                    </Col>

                </Row>
                <Form form={form} onFinish={handleOk} initialValues={{alertDate: alertDate}}>
                    <Row>
                        <Col span={13}>
                            <FormItem
                                {...formItemLayout} label="Signal Status" name="status"
                                initialValue={getInitialValue('status')}
                                rules={[{ required: true, message: "Signal Status required" }]}>
                                <FieldStatusOptionSet id="diU0rgqKDzu" placeholder="Status"
                                    name='status' form={form} />
                            </FormItem>
                            <FormItem name="status_update_date" hidden={true}
                                initialValue={getInitialValue('status_date_update')}
                            >
                                <Input />
                            </FormItem>
                            {store.IsGlobalUser &&
                                <FormItem
                                    {...formItemLayout} label="District" name="district"
                                    rules={[{ required: true, message: "District is required" }]}
                                    initialValue={getInitialValue('district')}>
                                    <FieldDistrict name="district" form={form} />
                                </FormItem>
                            }
                            {/* {store.IsGlobalUser &&
                                <FormItem
                                    {...formItemLayout} label='Notify Users' name='notifyusers'
                                    initialValue={getInitialValue('notifyusers')}
                                >
                                    <FieldUserGroup value={selectedGroups} name='notifyusers' form={form} />
                                </FormItem>
                            } */}
                            <FormItem
                                {...formItemLayout} label="Date of SMS Followup" name="followupDate">
                                <DatePicker style={{ width: "100%" }}
                                    placeholder={getInitialValue('followupDate')} format="YYYY-MM-DD"
                                    defaultValue={
                                        moment(getInitialValue('followupDate'), "YYYY-MM-DD") &&
                                            moment(getInitialValue('followupDate'), "YYYY-MM-DD").isValid() ?
                                            moment(getInitialValue('followupDate'), "YYYY-MM-DD") : undefined
                                    }
                                    disabledDate={disabledDate}
                                />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Date Signal Received"
                                name="alertDate"
                                hidden={false}>
                                <DatePicker disabledDate={disabledDate}/>
                            </FormItem>

                            <FormItem {...formItemLayout} label="Case/Event Type" name="eventType"
                                initialValue={getInitialValue('eventType')}
                            >
                                <FieldCaseTypeOptionSet id="stZ0w17GD28" placeholder="Case/Event Type"
                                    form={form} name="eventType" />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Date of Onset" name="dateOfOnset"
                            >

                                <DatePicker style={{ width: "100%" }}
                                    placeholder={getInitialValue('dateOfOnset')} format="YYYY-MM-DD"
                                    defaultValue={
                                        moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD") &&
                                            moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD").isValid() ?
                                            moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD") : undefined
                                    }
                                    disabledDate={disabledDate}
                                />
                            </FormItem>
                            {/* Age and Gender Go Here */}
                            <FieldAgev2 name="age" visible={store.caseTypeHumanSelected} form={form}
                                value={
                                    {
                                        years: getInitialValue('years'),
                                        months: getInitialValue('months'),
                                        days: getInitialValue('days')
                                    }
                                }
                            />

                            <FormItem
                                {...formItemLayout} label="Gender" name="gender"
                                initialValue={getInitialValue('gender')}
                                style={!store.caseTypeHumanSelected ? { display: 'none' } : { hidden: false }}>
                                <FieldOptionSet id="WNqjeSlrS3r" placeholder="Gender"
                                    name='gender' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Location" name="location"
                                initialValue={getInitialValue('location')}>
                                <Input placeholder="Location (Village/Parish/Sub-county/District)" />
                            </FormItem>

                            {/* Patient has Signs goes here */}

                        </Col>
                        <Col span={11}>
                            <FormItem hidden={true} name="event" initialValue={message.id}>
                                <Input />
                            </FormItem>

                            <FormItem hidden={true} name="text" initialValue={message.text}>
                                <Input />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Name of Reporter" name="nameOfSubmitter"
                                initialValue={getInitialValue('nameOfSubmitter')}>
                                <Input placeholder="Name of Reporter" />
                            </FormItem>


                            <FormItem
                                {...formItemLayout} label="Patient has Signs" name="hasSigns"
                                initialValue={getInitialValue('hasSigns')}
                                style={
                                    (store.caseTypeAnimalSelected || store.caseTypeHumanSelected) ?
                                        { hidden: false } : { display: 'none' }}>
                                <FieldOptionSet id="L6eMZDJkCwX" placeholder="Patient has Signs"
                                    name='hasSigns' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Suspected Disease" name="suspectedDisease"
                                initialValue={getInitialValue('suspectedDisease')}
                                style={
                                    (store.caseTypeHumanSelected || store.caseTypeAnimalSelected) ? { hidden: false } : { display: 'none' }}>
                                <FieldOptionSet id="oQFHDyTSH5D" placeholder="Suspected Event"
                                    name='suspectedDisease' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Source of Signal" name="rumorSource"
                                initialValue={getInitialValue('rumorSource')}>
                                <FieldOptionSet id="x7kVdpPf6ry" placeholder="Source of Signal"
                                    name='rumorSource' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="Phone Number of Submitter" hidden={true}
                                name="phone" initialValue={message.phone}>
                                <Input placeholder="Phone Number of the Submitter" />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Action Taken" name="actionTaken"
                                initialValue={getInitialValue('actionTaken')}>
                                <FieldOptionSet id="GNTX1AnCPEL" placeholder="Action Taken"
                                    name='actionTaken' form={form} />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Followup Action" name="followupAction"
                                initialValue={getInitialValue('followupAction')}>
                                <FieldOptionSet id="ntjsL4UMoNW" placeholder="Followup Action"
                                    name='followupAction' form={form} />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="Comments"
                                name="comment" initialValue={getInitialValue('comment')}>
                                <TextArea rows={3} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </>
    );
})

EventDialog.propTypes = {
    message: PropTypes.PropTypes.object,
    event: PropTypes.PropTypes.object,
    refetchFn: PropTypes.func,
}