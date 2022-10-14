import { PropTypes } from '@dhis2/prop-types'
import React, { useState } from 'react'
import moment from 'moment';
import { 
    Modal, 
    Form, 
    Button, 
    Input,  
    DatePicker, 
    TimePicker,
    Space, 
    Row, 
    Col,
    Tabs,
    Checkbox,
    message as antdMessage
} from 'antd'
import { FieldDistrict } from '../../orgUnit/FieldDistrict'
import { FieldDistrict2 } from '../../orgUnit/FieldDistrict2'
import { FieldOptionSet } from '../../events/FieldOptionSet'
import { FieldStatusOptionSet } from '../../events/FieldStatusOptionSet'
import { FieldUserGroup } from '../../events/FieldUserGroup'
import { FieldCaseTypeOptionSet } from '../../events/FieldCaseTypeOptionSet'
import { FieldActionTakenOptionSet } from '../../events/FieldActionTakenOptionSet'
import { FieldYesOnly } from '../../events/FieldYesOnly'
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
const format = 'HH:mm';
const TabPane = Tabs.TabPane;

export const EventDialog = observer(({ message, event, refetchFn }) => {
    const store = useStore()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentEventValues, setCurrentEventValues] = useState({})
    const [modalTitle, setModleTitle] = useState("Create Alert Event")
    const [selectedGroups, setSelectedGroups] = useState([])
    
    const signalDetailsKey = message.id ? `signalDetals-${message.id}`: 'signalDetails'
    const caseVerificationKey = message.id ? `caseVerification-${message.id}`: 'caseVerification'

    const showModal = () => {
        console.log("MESSAGE", message)
        const cValues = eventToMessage(event)
        console.log("eventFromMessage", cValues)
        store.setActiveSignalTabKey(signalDetailsKey)
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
        switch (cValues['actionTaken']){
            case 'Case Verification Desk':
                // store.setActiveSignalTabKey(caseVerificationKey)
                break
            default:
                store.setActiveSignalTabKey(signalDetailsKey)
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
                    if (values[i] && values[i] instanceof Object) {
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
                case 'fieldVerificationDate':
                    if (values[i] && values[i] instanceof Object) {
                        dataValues.push({
                            dataElement: eventConfs[i],
                            value: values[i].format("YYYY-MM-DD")
                        })
                    }
                    break
                case 'ambulanceNotificationDate':
                    if (values[i] && values[i] instanceof Object) {
                        dataValues.push({
                            dataElement: eventConfs[i],
                            value: values[i].format("YYYY-MM-DD")
                        })
                    }
                    break
                case 'timeOfDeparture':
                    if (values[i] && values[i] instanceof Object) {
                        dataValues.push({
                            dataElement: eventConfs[i],
                            value: values[i].format("HH:mm")
                        })
                    }
                    break
                case 'timeOfDispatcherNotification':
                    if (values[i] && values[i] instanceof Object) {
                        dataValues.push({
                            dataElement: eventConfs[i],
                            value: values[i].format("HH:mm")
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
                case 'ems':
                case 'fieldVerification':
                    if (values[i]) {
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
        const resp = saveEvent(eventPayload)
        /*
        .then((value) => {
            if (value) {
                refetchFn()
            }
        })*/
        setIsModalVisible(false);
        if (resp){
            refetchFn()
            antdMessage.success({
                content: "Saved Successfully",
            })
        }else {
            antdMessage.error("Failed to Save", 10);
        }
    }
    const [form] = Form.useForm();

    // const alertDate = moment(message.receiveddate, moment.HTML5_FMT.DATE);
    const alertDate = moment(message.receiveddate);
    // console.log("Alert Date=>", alertDate, "Received Date", message.receiveddate)

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: {span: 8}
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
            md: {span: 12}
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
    const tabChange = (key) => {
        // console.log("current tab is ", key);
        store.setActiveSignalTabKey(key);
    }
    // console.log("==========", signalDetailsKey, store.activeSignalTabKey, caseVerificationKey)

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
                <Form form={form} onFinish={handleOk} 
                initialValues={{
                    alertDate: alertDate,

                    fieldVerificationDate: moment(getInitialValue('fieldVerificatioinDate'), "YYYY-MM-DD") &&
                        moment(getInitialValue('fieldVerificationDate'), "YYYY-MM-DD").isValid() ?
                        moment(getInitialValue('fieldVerificationDate'), "YYYY-MM-DD") : undefined,

                    ambulanceNotificationDate: moment(getInitialValue('ambulanceNotificationDate'), "YYYY-MM-DD") &&
                        moment(getInitialValue('ambulanceNotificationDate'), "YYYY-MM-DD").isValid() ?
                        moment(getInitialValue('ambulanceNotificationDate'), "YYYY-MM-DD") : undefined,

                    followupDate: moment(getInitialValue('followupDate'), "YYYY-MM-DD") &&
                        moment(getInitialValue('followupDate'), "YYYY-MM-DD").isValid() ?
                        moment(getInitialValue('followupDate'), "YYYY-MM-DD") : undefined,

                    dateOfOnset: moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD") &&
                        moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD").isValid() ?
                        moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD") : undefined, 

                    timeOfDeparture: moment(getInitialValue('timeOfDeparture'), "HH:mm") &&
                        moment(getInitialValue('timeOfDeparture'), "HH:mm").isValid() ?
                        moment(getInitialValue('timeOfDeparture'), "HH:mm") : undefined,

                    timeOfDispatcherNotification: moment(getInitialValue('timeOfDispatcherNotification'), "HH:mm") &&
                        moment(getInitialValue('timeOfDispatcherNotification'), "HH:mm").isValid() ?
                        moment(getInitialValue('timeOfDispatcherNotification'), "HH:mm") : undefined
                }}
                layout="horizontal"
                labelAlign='left'
                
                >
                <Tabs onChange={tabChange}
                    type="card"
                    defaultActiveKey={signalDetailsKey}
                    activeKey={store.activeSignalTabKey}
                >
                    <TabPane tab="Signal Details" key={signalDetailsKey}>
                    <Row>
                        <Col span={11}>
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
                                <Input name="status_update_date"/>
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="District" name="district"
                                rules={[{ required: true, message: "District is required" }]}
                                initialValue={getInitialValue('district')}>
                                <FieldDistrict2 name="district" form={form} />
                            </FormItem>
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
                                    name="followupDate"
                                    placeholder={getInitialValue('followupDate')} format="YYYY-MM-DD"
                                    
                                    disabledDate={disabledDate}
                                />
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Date Signal Received"
                                name="alertDate"
                                hidden={false}>
                                <DatePicker name="alertDate" disabledDate={disabledDate}/>
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
                                    name="dateOfOnSet"
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
                                <Input placeholder="Location (Village/Parish/Sub-county/District)" name="location"/>
                            </FormItem>

                            {/* Patient has Signs goes here */}

                        </Col>
                        <Col span={13}>
                            <FormItem hidden={true} name="event" initialValue={message.id}>
                                <Input name="event"/>
                            </FormItem>

                            <FormItem hidden={true} name="text" initialValue={message.text}>
                                <Input name="text"/>
                            </FormItem>
                            <FormItem
                                {...formItemLayout} label="Name of Reporter" name="nameOfSubmitter"
                                initialValue={getInitialValue('nameOfSubmitter')}>
                                <Input placeholder="Name of Reporter" name="nameOfSubmitter" />
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
                                <Input placeholder="Phone Number of the Submitter" name="phone"/>
                            </FormItem>

                            <FormItem
                                {...formItemLayout} label="Action Taken" name="actionTaken"
                                initialValue={getInitialValue('actionTaken')}>
                                <FieldActionTakenOptionSet id="GNTX1AnCPEL" placeholder="Action Taken"
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
                    </TabPane>
                    <TabPane tab="Case Verification" key={caseVerificationKey}>
                    <Row>
                                <Col span={11}>
                                    <FormItem
                                        {...formItemLayout} label="case Verification Desk" 
                                        name="caseVerificationDesk" initialValue={getInitialValue('caseVerificationDesk')}>
                                        <FieldOptionSet id="BI2CXaXdwkr" placeholder="" 
                                        name='caseVerificationDesk' form={form} />
                                    </FormItem> 

                                    <FormItem
                                        {...formItemLayout} label="Field Verification" name="fieldVerification"
                                        initialValue={getInitialValue('fieldVerification')}
                                        >
                                        <FieldYesOnly name="fieldVerification" form={form} 
                                            defaultVal={getInitialValue('fieldVerification')}
                                            />
                                    </FormItem>

                                    <FormItem
                                        {...formItemLayout} label="Date of Field Verification" 
                                        name="fieldVerificationDate">
                                        <DatePicker style={{ width: "100%", right:"0px"}}
                                        
                                            disabledDate={disabledDate}/>
                                    </FormItem>

                                    <FormItem
                                        {...formItemLayout} label="Departure Time" 
                                        name="timeOfDeparture">
                                        <TimePicker format={format} name="timeOfDeparture" />

                                    </FormItem>

                                    <FormItem
                                        {...formItemLayout} label="Field Team Names" 
                                        name="fieldTeamNames" initialValue={getInitialValue('fieldTeamNames')}>
                                        <TextArea rows={2} placeholder="Field Team Names"/>

                                    </FormItem>

                                </Col>
                                <Col span={13}>
                                    
                                    <FormItem
                                        {...formItemLayout} label="EMS" name="ems" initialValue={getInitialValue('ems')}
                                        >
                                            <FieldYesOnly name="ems" defaultVal={getInitialValue('ems')} form={form}/>
                                    </FormItem>

                                    <FormItem
                                        {...formItemLayout} label="Date of Ambulance team Notification"
                                        name="ambulanceNotificationDate">
                                        <DatePicker style={{width:"100%"}}
                                            
                                            disabledDate={disabledDate}/>
                                    </FormItem>

                                    <FormItem
                                        {...formItemLayout} label="Time of Dispatcher Notification" 
                                        name="timeOfDispatcherNotification">
                                        <TimePicker format={format} style={{width:"100%"}} name="timeOfDispatcherNotification" />
                                    </FormItem>

                                    <FormItem
                                        {...formItemLayout} label="Who Received the call" 
                                        name="whoReceivedCall" form={form} placeholder="whoReceivedCall"
                                         initialValue={getInitialValue('whoReceivedCall')}
                                        >
                                        <Input name="whoReceivedCall" />
                                    </FormItem>

                                    <FormItem
                                        {...formItemLayout} label="EMS Feedbak" 
                                        name="emsFeedback" initialValue={ getInitialValue('emsFeedback')} placeholder="EMS Feedback">
                                        <FieldOptionSet id="r9AyEn7asVy" form={form} name="emsFeedback"/>
                                    </FormItem>

                                </Col>
                            </Row>
                        </TabPane>
                        </Tabs>
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