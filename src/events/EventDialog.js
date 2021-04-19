// import { PropTypes } from '@dhis2/prop-types'
import React, {useState, useEffect} from 'react'
import moment from 'moment';
import {Modal, Form, Button, Input, DatePicker, Space} from 'antd'
import { FieldDistrict } from '../orgUnit/FieldDistrict'
import {FieldOptionSet} from './FieldOptionSet'
import {FieldUserGroup} from './FieldUserGroup'
import {useReadUserIsGlobal} from '../hooks'
import {
    fetchEvent, 
    eventConfs, 
    sendNotifications,
    saveEvent,
    userIsGlobalUser
} from './Events'

import i18n from '../locales'

const FormItem = Form.Item;
const TextArea = Input.TextArea

export const EventDialog = ({ message}) => {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [currentEventValues, setCurrentEventValues] = useState({})
    const [modalTitle, setModleTitle] = useState("Create Alert Event")
    const [selectedGroups, setSelectedGroups] = useState([])
    const [userIsGlobal, setUserIsGlobal] = useState(useReadUserIsGlobal())
    const getUserGlobalStatus = async () => {
        const org = await userIsGlobalUser()
        setUserIsGlobal(org)
    }
    useEffect(() => {
        getUserGlobalStatus()
    }, [userIsGlobal])
    
    const showModal = async () => {
        const cValues = await fetchEvent(message.id)
        console.log("Fetched Values = ", cValues)
        setCurrentEventValues(cValues)
        if ('district' in cValues){
            setModleTitle("Update Alert Event")
        }
        setIsModalVisible(true)
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }
    
    const getInitialValue = (field) => {
        if (field in currentEventValues){
            return currentEventValues[field]
        }
        return "";
    } 

    const handleOk = async (values) => {
        console.log("submited values", values)
        if (typeof values.notifyusers != "undefined" & values.notifyusers.length){
            const msgPayload = {
              subject: "Alert from "+ message.originator + " on " + message.receiveddate,
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
        let dataValues = [];
        for (let i in values) {
            if (i === 'dateOfOnset' && values[i] instanceof Object){
                // Only add dateOfOnset if defined
                const onsetDate = values[i].toISOString().slice(0, 10)
                dataValues.push({dataElement: eventConfs[i], value: onsetDate})
            }
            else{
                if (i in eventConfs){ // Let's only add those dateElements in our configuration
                    dataValues.push({dataElement: eventConfs[i], value: values[i]})
                }
            }
        }
        const eventPayload = {
            event: values["event"],
            program: eventConfs["program"],
            orgUnit: values["district"],
            // eventDate: values["alertDate"]["_d"].toISOString().slice(0, 10),
            eventDate: values["alertDate"],
            status: "COMPLETED",
            completeDate: completeDate,
            // storedBy: '',
            dataValues: dataValues
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
    return (
        <>
            <Button type="default" onClick={showModal}>
                {i18n.t('Log Event')}
            </Button>
           
            <Modal title={modalTitle} visible={isModalVisible} 
                onOk={form.submit} onCancel={handleCancel} okText="Save" 
                confirmLoading={false} width="50%">
                <Space direction="vertical"></Space>
                <Form form={form} onFinish={handleOk}>

                    <FormItem hidden={true} name="event" initialValue={message.id}>
                        <Input/>
                    </FormItem>
                    {/*
                    <FormItem
                        {...formItemLayout} 
                        label="Alert"  
                        name="message" initialValue={message.text}>
                        <TextArea  disabled rows={1}/>
                    </FormItem>*/}
                    { userIsGlobal &&
                    <FormItem
                        {...formItemLayout} label="District" name="district"
                        rules={[{required: true, message: "District is required"}]}
                        initialValue={getInitialValue('district')}>
                        <FieldDistrict name="district" form={form}/>
                    </FormItem>
                    }
                    { userIsGlobal &&
                    <FormItem
                        {...formItemLayout} label='Notify Users' name='notifyusers'
                        initialValue={getInitialValue('notifyusers')} 
                     >
                         <FieldUserGroup value={selectedGroups} name='notifyusers' form={form}/>
                     </FormItem>
                    }

                    <FormItem   
                        {...formItemLayout} label="Date Alert Received" 
                            name="alertDate" initialValue={alertDate._i.slice(0, 10)}
                        hidden={true}>
                        <Input />
                    </FormItem>
                    
                    <FormItem {...formItemLayout} label="Case/Event Type" name="eventType" 
                        rules={[{required: true, message: "Case Type is required"}]}
                        initialValue={getInitialValue('eventType')} 
                        >
                        <FieldOptionSet id="stZ0w17GD28" placeholder="Case/Event Type" 
                        form={form} name="eventType"/>
                    </FormItem>

                    <FormItem   
                       {...formItemLayout} label="Date of Onset" name="dateOfOnset"
                        rules={[{required: true, message: "Date of Oneset required"}]}>
                    
                        <DatePicker style={{width: "60%"}} 
                            placeholder={getInitialValue('dateOfOnset')} format="YYYY-MM-DD"
                            value={moment(getInitialValue('dateOfOnset'), "YYYY-MM-DD")}
                        />
                    </FormItem>

                    <FormItem
                        {...formItemLayout} label="Location" name="location"
                        initialValue={getInitialValue('location')}>
                        <Input placeholder="Location (Village/Parish/Sub-county/District)"/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout} label="Name of Submitter" name="nameOfSubmitter"
                        initialValue ={getInitialValue('nameOfSubmitter')}>
                        <Input placeholder="Name of Submitter" />
                    </FormItem>

                    <FormItem
                        {...formItemLayout} 
                        label="Phone Number of Submitter" hidden={true} 
                        name="phone" initialValue={message.originator}>
                            <Input placeholder="Phone Number of the Submitter"/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout} label="Source of Rumor" name="rumorSource"
                        initialValue={getInitialValue('rumorSource')}>
                        <FieldOptionSet id="x7kVdpPf6ry" placeholder="Source of Rumor"
                        name='rumorSource' form={form}/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout} label="Status" name="status"
                        initialValue={getInitialValue('status')}>
                        <FieldOptionSet id="GNTX1AnCPEL" placeholder="Status"
                        name='status' form={form}/>
                    </FormItem>

                    <FormItem
                        {...formItemLayout} label="Action Taken" name="actionTaken"
                        initialValue={getInitialValue('actionTaken')}>
                        <FieldOptionSet id="GNTX1AnCPEL" placeholder="Action Taken"
                        name='actionTaken' form={form}/>
                    </FormItem>

                </Form>
            </Modal>
            
        </>
    );
}
