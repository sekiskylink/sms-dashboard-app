// import { PropTypes } from '@dhis2/prop-types'
import React, { useState, useEffect } from 'react'
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
    message as antdMessage
} from 'antd'
import { FieldDistrict } from '../orgUnit/FieldDistrict'
import { FieldDistrict2 } from '../orgUnit/FieldDistrict2'
import { FieldOptionSet } from './FieldOptionSet'
import { FieldStatusOptionSet } from './FieldStatusOptionSet'
import { FieldCaseTypeOptionSet } from './FieldCaseTypeOptionSet'
import { FieldUserGroup } from './FieldUserGroup'
import { FieldYesOnly } from './FieldYesOnly'
import { FieldActionTakenOptionSet } from './FieldActionTakenOptionSet'
import { FieldAgev2 } from './FieldAgev2'
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
const format = 'HH:mm';
const TabPane = Tabs.TabPane;

export const EventDialog = observer(({ message, forUpdate, refetchFn }) => {
    const store = useStore()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentEventValues, setCurrentEventValues] = useState({})
    const [modalTitle, setModleTitle] = useState("Create Signal Event")
    const [IsSignalDetailsTabVisible, setIsSignalDetailsTabVisible] = useState(true)
    // const [selectedGroups, setSelectedGroups] = useState([])

    const signalDetailsKey = message.id ? `forward-signalDetals-${message.id}`: 'forward-signalDetails'
    const caseVerificationKey = message.id ? `forward-caseVerification-${message.id}`: 'forward-caseVerification'

    const showModal = async () => {
        const cValues = await fetchEvent(message.id)
        console.log("Fetched Values = ", cValues)
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
                console.log("Selected Case Verification Desk")
                // store.setActiveForwardSignalTabKey(caseVerificationKey)
                break
            default:
                store.setActiveForwardSignalTabKey(signalDetailsKey)
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
                subject: "Signal from " + message.originator + " on " + message.receiveddate,
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
        const resp = await saveEvent(eventPayload)
        /*.then((value) => {
            if (value) {
                refetchFn()
            }
        });*/
        setIsModalVisible(false);
        if (resp){
            antdMessage.success("Saved Successfully")
            refetchFn()
        }else {
            antdMessage.error("Error Saving Event");
        }
    }
    const [form] = Form.useForm();

    const alertDate = moment(message.receiveddate, moment.HTML5_FMT.DATE);
    // console.log("Alert Date=>", alertDate, "Received Date", message.receiveddate)

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
            md: {span: 8},
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
            md: {span: 12},
        },
    };
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    }
    const tabChange = (key) => {
        console.log("current tab is ", key);
    }

    const buttonName = forUpdate === 1 ? 'Update Signal' : 'Forward Signal'
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
                    {/* <p style={{ textAlign: "left" }}> From:({message.originator}), Msg:{message.text}</p> */}
                    <Row>
                        <Col span={4}>
                            <p style={{ textAlign: "left" }}>From: {message.originator}</p>
                        </Col>
                        <Col span={20}>
                            <p style={{ textAlign: "left" }}>Msg: {message.text} </p>
                        </Col>
                    </Row>

                    <Form form={form} onFinish={handleOk} 
                        initialValues={{
        
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
                    >
                    <Tabs onChange={tabChange} 
                        type="card"
                        defaultActiveKey={signalDetailsKey}
                        activeKey={store.activeForwardSignalTabKey}>
                    <TabPane tab="Signal Details" key={signalDetailsKey}>
                        <Row>
                            <Col span={13}>
                                <FormItem
                                    {...formItemLayout} label="Signal Status" name="status"
                                    rules={[{ required: true, message: "Signal status is required" }]}
                                    initialValue={getInitialValue('status')}>
                                    <FieldStatusOptionSet id="diU0rgqKDzu" placeholder="Status"
                                        name='status' form={form} />
                                </FormItem>

                                {store.IsGlobalUser &&
                                    <FormItem
                                        {...formItemLayout} label="District" name="district"
                                        rules={[{ required: true, message: "District is required" }]}
                                        initialValue={getInitialValue('district')}>
                                        <FieldDistrict2 name="district" form={form} />
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
                                    {...formItemLayout} label="Date Signal Received"
                                    name="alertDate" initialValue={alertDate._i.slice(0, 10)}
                                    hidden={true}>
                                    <Input />

                                </FormItem>

                                <FormItem
                                    {...formItemLayout} label="Date of SMS Followup" name="followupDate">
                                    <DatePicker style={{ width: "60%" }}
                                        placeholder={getInitialValue('followupDate')} format="YYYY-MM-DD"
                                        
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
                                        
                                        disabledDate={disabledDate}
                                    />
                                </FormItem>
                                {/* Age and Gender go here */}
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
                                <FieldActionTakenOptionSet id="GNTX1AnCPEL" placeholder="Action Taken"
                                    name='actionTaken' form={form} identifier="forwardEvent"/>
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
                                    <TextArea rows={2} />
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
                                            defaultVal={getInitialValue('fieldVerification') ? getInitialValue('fieldVerification'): false}
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
                                            <FieldYesOnly name="ems" defaultVal={getInitialValue('ems') ? getInitialValue('ems'): false} 
                                            form={form}/>
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
