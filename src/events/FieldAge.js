import { Form, DatePicker, Input, InputNumber } from 'antd'
import propTypes from 'prop-types'
import moment from 'moment'

const FormItem = Form.Item;

export const FieldAge = ({ name, visible, form, value }) => {

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    }
    const disabledDate = (current) => {
        // Can not select days after today
        return current && current > moment().endOf('day');
    }

    const yearsChanged = (years) => {
        const fields = form.getFieldsValue()
        const days = fields["age"].days
        const months = fields["age"].months
        const totalDays = (days ? days : 0) + (365 * years) + (30 * (months ? months : 0))
        console.log("Total Days: = ", totalDays)

        fields["age"].age = (totalDays > 0) ? moment().subtract(totalDays, 'days') : undefined
        form.setFieldsValue(fields)
        // console.log(fields)
    }

    const monthsChanged = (months) => {
        const fields = form.getFieldsValue()
        const years = fields["age"].years
        const days = fields["age"].days
        const totalDays = (days ? days : 0) + (365 * (years ? years : 0)) + (30 * months)
        fields["age"].age = (totalDays > 0) ? moment().subtract(totalDays, 'days') : undefined
        form.setFieldsValue(fields)
        // console.log("Total Days: = ", totalDays)
    }

    const daysChanged = (days) => {
        const fields = form.getFieldsValue()
        const years = fields["age"].years
        const months = fields["age"].months
        const totalDays = days + (365 * (years ? years : 0)) + (30 * (months ? months : 0))
        fields["age"].age = (totalDays > 0) ? moment().subtract(totalDays, 'days') : undefined
        form.setFieldsValue(fields)
        // console.log("Total Days: = ", totalDays)
    }

    return (
        <>
            <FormItem {...formItemLayout} label="Age"
                style={!visible ? { display: 'none' } : { hidden: false }}>
                <Input.Group compact>
                    <FormItem
                        name={['age', name]}
                        noStyle
                    >
                        <DatePicker style={{ width: '40%' }} format="YYYY-MM-DD"
                            placeholder="YYYY-MM-DD"
                            defaultValue={value && value.isValid() ? value : undefined}
                            disabledDate={disabledDate}
                        />
                    </FormItem>
                    <FormItem
                        name={['age', 'years']}
                        noStyle
                        rules={[{ type: 'number', min: 0, max: 99 }]}
                    >
                        <InputNumber style={{ width: '20%' }} placeholder="Years"
                            onChange={yearsChanged} />
                    </FormItem>
                    <FormItem
                        name={['age', 'months']}
                        noStyle
                        rules={[{ type: 'number', min: 0, max: 11 }]}
                    >
                        <InputNumber style={{ width: '20%' }} placeholder="Months"
                            onChange={monthsChanged} />
                    </FormItem>
                    <FormItem
                        name={['age', 'days']}
                        noStyle
                        rules={[{ type: 'number', min: 0, max: 30 }]}
                    >
                        <InputNumber style={{ width: '20%' }} placeholder="Days"
                            onChange={daysChanged} />
                    </FormItem>
                </Input.Group>
            </FormItem>
        </>
    )
}

FieldAge.propTypes = {
    visible: propTypes.bool.isRequired,
    name: propTypes.string.isRequired,
    form: propTypes.object,
    value: propTypes.object,
}