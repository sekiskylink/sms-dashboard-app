// import { PropTypes } from '@dhis2/prop-types'
import React, { useState, useEffect } from 'react'
import moment from 'moment';
import { Modal, Form, Button, Input, DatePicker, Space, Row, Col } from 'antd'
import { FieldDistrict } from '../orgUnit/FieldDistrict'
import { FieldOptionSet } from './FieldOptionSet'
import { FieldStatusOptionSet } from './FieldStatusOptionSet'
import { FieldCaseTypeOptionSet } from './FieldCaseTypeOptionSet'
import { FieldUserGroup } from './FieldUserGroup'
import { FieldAge } from './FieldAge'
import { useStore } from '../context/context'
import { observer } from 'mobx-react-lite'
import {
    fetchEvent,
    eventConfs,
    sendNotifications,
    saveEvent,
} from './Events'

import i18n from '../locales'

const FormItem = Form.Item;
const TextArea = Input.TextArea

export const EventDialog = observer(({ message, forUpdate }) => {
    const store = useStore()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentEventValues, setCurrentEventValues] = useState({})
    const [modalTitle, setModleTitle] = useState("Create Alert Event")
    // const [selectedGroups, setSelectedGroups] = useState([])

    const showModal = async () => {
        const cValues = await fetchEvent(message.id)
        console.log("Fetched Values = ", cValues)
        setCurrentEventValues(cValues)
        if ('district' in cValues) {
            setModleTitle("Update Alert Event")
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
        if (typeof values.notifyusers != "undefined" && values.notifyusers.length) {
            const msgPayload = {
                subject: "Alert from " + message.originator + " on " + message.receiveddate,
                text: message.text + " [from: " + message.originator + " on: " + message.receiveddate + "]",
                userGroups: values.notifyusers.map(i => {
                    const y = {};
                    y["id"] = i;
                    return y;
                })
            }
            console.log(msgPayload);
            await sendNotifications(msgPayload)
        }

        // Prepare to create or update event
        const completeDate = new Date().toISOString().slice(0, 10);
        var toCompleteEvent = false
        var assignToNationalLevel = false
        let dataValues = [];
        var age = ""
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
                    age = values[i] && Object.keys(values[i]).length > 0 && values[i].age ?
                        values[i].age.format("YYYY-MM-DD") : ""
                    if (age !== "" && age !== undefined) {
                        dataValues.push({ dataElement: eventConfs[i], value: age })
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
            //status: "COMPLETED",
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
        saveEvent(eventPayload);
        setIsModalVisible(false);
    }
    const [form] = Form.useForm();

    const alertDate = moment(message.receiveddate, moment.HTML5_FMT.DATE);
    // console.log("Alert Date=>", alertDate, "Received Date", message.receiveddate)

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

    const buttonName = forUpdate === 1 ? 'Update Event' : 'Forward Event'
    const okTextName = forUpdate === 1 ? 'Update' : 'Save'
    return (
        <>
            <Button type="default" onClick={showModal}>
                {i18n.t(buttonName)}
            </Button>

            <Modal title={modalTitle} visible={isModalVisible}
                onOk={form.submit} onCancel={handleCancel} okText={i18n.t(okTextName)}
                confirmLoading={false} width="79%">
                <Space direction="vertical"></Space>
                <p style={{ textAlign: "left" }}> Message: {message.text}</p>
                <Form form={form} onFinish={handleOk}>
                    <Row>
                        <Col span={13}>
                            <FormItem
                                {...formItemLayout} label="SMS Status" name="status"
                                initialValue={getInitialValue('status')}>
                                <FieldStatusOptionSet id="UrGEIjjyY0A" placeholder="Status"
                                    name='status' form={form} />
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
                                {...formItemLayout} label="Date Alert Received"
                                name="alertDate" initialValue={alertDate._i.slice(0, 10)}
                                hidden={true}>
                                <Input />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Date of SMS Followup" name="followupDate">
                                <DatePicker style={{ width: "60%" }}
                                    placeholder={getInitialValue('followupDate')} format="YYYY-MM-DD"
                                    defaultValue={
                                        moment(getInitialValue('followupDate'), "YYYY-MM-DD") &&
                                            moment(getInitialValue('followupDate'), "YYYY-MM-DD").isValid() ?
                                            moment(getInitialValue('followupDate'), "YYYY-MM-DD") : undefined
                                    }
                                    disabledDate={disabledDate}
                                />
                            </FormItem>

                            <FormItem {...formItemLayout} label="Case/Event Type" name="eventType"
                                // rules={[{required: true, message: "Case Type is required"}]}
                                initialValue={getInitialValue('eventType')}
                            >
                                <FieldCaseTypeOptionSet id="stZ0w17GD28" placeholder="Case/Event Type"
                                    form={form} name="eventType" />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Date of Onset" name="dateOfOnset"
                            // rules={[{required: true, message: "Date of Oneset required"}]}
                            >

                                <DatePicker style={{ width: "60%" }}
                                    placeholder={getInitialValue('dateOfOnset')} format="YYYY-MM-DD"
                                    defaultValue={
                                        moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD").isValid() ?
                                            moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD") : undefined
                                    }
                                    disabledDate={disabledDate}
                                />
                            </FormItem>
                            {/* Age and Gender go here */}
                            <FieldAge name="age" visible={store.caseTypeHumanSelected} form={form}
                                value={moment(getInitialValue('age'), "YYYY-MM-DD")}
                            />
                            <FormItem
                                {...formItemLayout} label="Gender" name="gender"
                                initialValue={getInitialValue('gender')}
                                style={!store.caseTypeHumanSelected ? { display: 'none' } : { hidden: false }}>
                                <FieldOptionSet id="WNqjeSlrS3r" placeholder="Gender"
                                    name='gender' form={form} />
                            </FormItem>


                        </Col>
                        <Col span={11}>
                            <FormItem hidden={true} name="event" initialValue={message.id}>
                                <Input />
                            </FormItem>

                            <FormItem hidden={true} name="text" initialValue={message.text}>
                                <Input />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Location" name="location"
                                initialValue={getInitialValue('location')}>
                                <Input placeholder="Location (Village/Parish/Sub-county/District)" />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Name of Submitter" name="nameOfSubmitter"
                                initialValue={getInitialValue('nameOfSubmitter')}>
                                <Input placeholder="Name of Submitter" />
                            </FormItem>


                            <FormItem
                                {...formItemLayout}
                                label="Phone Number of Submitter" hidden={true}
                                name="phone" initialValue={message.originator}>
                                <Input placeholder="Phone Number of the Submitter" />
                            </FormItem>

                            <FormItem name="status_update_date" hidden={true}
                                initialValue={getInitialValue('status_date_update')}
                            >
                                <Input />
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
                                {...formItemLayout} label="Source of Rumor" name="rumorSource"
                                initialValue={getInitialValue('rumorSource')}>
                                <FieldOptionSet id="x7kVdpPf6ry" placeholder="Source of Rumor"
                                    name='rumorSource' form={form} />
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
                                <FieldOptionSet id="OrBJ2CPJ94x" placeholder="Followup Action"
                                    name='followupAction' form={form} />
                            </FormItem>



                            <FormItem
                                {...formItemLayout}
                                label="Comments"
                                name="comment" initialValue={getInitialValue('comment')}>
                                <TextArea rows={2} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </>
    );
})
