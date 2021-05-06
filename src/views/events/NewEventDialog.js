import React, { useState } from 'react'
import moment from 'moment';
import { Modal, Form, Button, Input, DatePicker, Space, Row, Col } from 'antd'
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

const FormItem = Form.Item;
const TextArea = Input.TextArea

export const NewEventDialog = observer(() => {
    const store = useStore()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentEventValues, setCurrentEventValues] = useState({})
    const [modalTitle, setModleTitle] = useState("Create Alert Event")
    const [selectedGroups, setSelectedGroups] = useState([])

    const showModal = () => {

        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const handleOk = async (values) => {
        console.log("submited values", values)

        // Prepare to create or update event
        const completeDate = new Date().toISOString().slice(0, 10);
        var toCompleteEvent = false
        var assignToNationalLevel = false
        let dataValues = [];
        for (let i in values) {
            if (i === 'dateOfOnset' && values[i] instanceof Object) {
                // Only add dateOfOnset if defined
                const onsetDate = values[i].toISOString().slice(0, 10)
                dataValues.push({ dataElement: eventConfs[i], value: onsetDate })
            }
            else {
                if (i in eventConfs) { // Let's only add those dateElements in our configuration
                    dataValues.push({ dataElement: eventConfs[i], value: values[i] })

                    /*We only complet event if Action taken is present*/
                    if (i === 'actionTaken' && values[i].length > 0) {
                        toCompleteEvent = true
                    }
                    /* Assign unactionabel events to National level */
                    if (i === 'status' && values[i] === "unactionable") {
                        assignToNationalLevel = true
                    }
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
        saveEvent(eventPayload);
        setIsModalVisible(false);
    }
    const [form] = Form.useForm();

    const alertDate = moment(moment(), moment.HTML5_FMT.DATE);
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
    return (
        <>
            <Button type="default" onClick={showModal}>
                {i18n.t('New Event')}
            </Button>

            <Modal title={modalTitle} visible={isModalVisible}
                onOk={form.submit} onCancel={handleCancel} okText="Save"
                confirmLoading={false} width="80%">
                <Space direction="vertical"></Space>
                <Form form={form} onFinish={handleOk}>
                    <Row>
                        <Col span={13}>
                            <FormItem
                                {...formItemLayout} label="SMS Status" name="status"
                            >
                                <FieldStatusOptionSet id="UrGEIjjyY0A" placeholder="Status"
                                    name='status' form={form} />
                            </FormItem>
                            <FormItem name="status_update_date" hidden={true}

                            >
                                <Input />
                            </FormItem>
                            {store.IsGlobalUser &&
                                <FormItem
                                    {...formItemLayout} label="District" name="district"
                                    rules={[{ required: true, message: "District is required" }]}
                                >
                                    <FieldDistrict name="district" form={form} />
                                </FormItem>
                            }
                            {store.IsGlobalUser &&
                                <FormItem
                                    {...formItemLayout} label='Notify Users' name='notifyusers'

                                >
                                    <FieldUserGroup value={selectedGroups} name='notifyusers' form={form} />
                                </FormItem>
                            }
                            <FormItem
                                {...formItemLayout} label="Date of SMS Followup" name="followupDate">
                                <DatePicker style={{ width: "60%" }}

                                />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Date Alert Received"
                                name="alertDate"
                                hidden={true}>
                                <Input />
                            </FormItem>

                            <FormItem {...formItemLayout} label="Case/Event Type" name="eventType"

                            >
                                <FieldCaseTypeOptionSet id="stZ0w17GD28" placeholder="Case/Event Type"
                                    form={form} name="eventType" />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Date of Onset" name="dateOfOnset"
                            // rules={[{required: true, message: "Date of Oneset required"}]}
                            >

                                <DatePicker style={{ width: "60%" }}

                                />
                            </FormItem>
                            {/* Age and Gender Go Here */}
                            <FormItem
                                {...formItemLayout} hidden={false} label="Age" name="age"

                                style={!store.caseTypeHumanSelected ? { display: 'none' } : { hidden: false }}>
                                <Input placeholder="" />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Gender" name="gender"

                                style={!store.caseTypeHumanSelected ? { display: 'none' } : { hidden: false }}>
                                <FieldOptionSet id="WNqjeSlrS3r" placeholder="Gender"
                                    name='gender' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Location" name="location"
                            >
                                <Input placeholder="Location (Village/Parish/Sub-county/District)" />
                            </FormItem>


                            {/* Patient has Signs goes here */}


                        </Col>
                        <Col span={11}>
                            <FormItem hidden={true} name="event">
                                <Input />
                            </FormItem>

                            <FormItem hidden={true} name="text">
                                <Input />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Name of Submitter" name="nameOfSubmitter"
                            >
                                <Input placeholder="Name of Submitter" />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Source of Rumor" name="rumorSource"
                            >
                                <FieldOptionSet id="x7kVdpPf6ry" placeholder="Source of Rumor"
                                    name='rumorSource' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Patient has Signs" name="hasSigns"

                                style={
                                    (store.caseTypeAnimalSelected || store.caseTypeHumanSelected) ?
                                        { hidden: false } : { display: 'none' }}>
                                <FieldOptionSet id="L6eMZDJkCwX" placeholder="Patient has Signs"
                                    name='hasSigns' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="Phone Number of Submitter" hidden={true}
                                name="phone">
                                <Input placeholder="Phone Number of the Submitter" />
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Action Taken" name="actionTaken"
                            >
                                <FieldOptionSet id="GNTX1AnCPEL" placeholder="Action Taken"
                                    name='actionTaken' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Suspected Disease" name="suspectedDisease"

                                style={
                                    (store.caseTypeHumanSelected || store.caseTypeAnimalSelected) ? { hidden: false } : { display: 'none' }}>
                                <FieldOptionSet id="oQFHDyTSH5D" placeholder="Suspected Event"
                                    name='suspectedDisease' form={form} />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Followup Action" name="followupAction"
                            >
                                <FieldOptionSet id="OrBJ2CPJ94x" placeholder="Followup Action"
                                    name='followupAction' form={form} />
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="Comments"
                                name="comment">
                                <TextArea rows={3} />
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Modal>

        </>
    );
})