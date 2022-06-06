import { Form, DatePicker, Input, InputNumber } from 'antd'
import propTypes from 'prop-types'
import { observer } from "mobx-react-lite"
import { useStore } from '../context/context'

const FormItem = Form.Item;

export const FieldAgev2 = observer(({ name, visible, form, value }) => {

    const store = useStore()

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

    const yearsChanged = (years) => {
        const fields = form.getFieldsValue()
        const days = fields["age"].days
        const months = fields["age"].months
        if (!years) {
            // make days and months active
            store.setDaysDisabled(false)
            store.setMonthsDisabled(false)
        } else {
            store.setDaysDisabled(true)
            store.setMonthsDisabled(true)
        }

        form.setFieldsValue(fields)
        // console.log(fields)
    }

    const monthsChanged = (months) => {
        const fields = form.getFieldsValue()
        const years = fields["age"].years
        const days = fields["age"].days
        if (!months){
            // make years and days active
            store.setYearsDisabled(false)
            store.setDaysDisabled(false)
        } else {
            store.setYearsDisabled(true)
            store.setDaysDisabled(true)

        }
        fields["years"] = years

        form.setFieldsValue(fields)
        // console.log("Total Days: = ", totalDays)
    }

    const daysChanged = (days) => {
        const fields = form.getFieldsValue()
        const years = fields["age"].years
        const months = fields["age"].months
        if (!days) {
            // make years and months active
            store.setMonthsDisabled(false)
            store.setYearsDisabled(false)
        } else {
            store.setMonthsDisabled(true)
            store.setYearsDisabled(true)

        }

        form.setFieldsValue(fields)
        // console.log("Total Days: = ", totalDays)
    }

    return (
        <>
            <FormItem {...formItemLayout} label="Age In"
                style={!visible ? { display: 'none' } : { hidden: false }}>
                <Input.Group compact>
                    <FormItem
                        name={['age', 'years']}
                        noStyle
                        rules={[{ type: 'number', min: 0, max: 100 }]}
                        initialValue={value.years}
                    >
                        <InputNumber style={{ width: '33%' }} placeholder="Years"
                            disabled={store.yearsDisabled}
                            onChange={yearsChanged} />
                    </FormItem>
                    <FormItem
                        name={['age', 'months']}
                        noStyle
                        rules={[{ type: 'number', min: 0, max: 100 }]}
                        initialValue={value.months}
                    >
                        <InputNumber style={{ width: '33%' }} placeholder="Months"
                            disabled={store.monthsDisabled}
                            onChange={monthsChanged} />
                    </FormItem>
                    <FormItem
                        name={['age', 'days']}
                        noStyle
                        rules={[{ type: 'number', min: 0, max: 365 }]}
                        initialValue={value.days}
                    >
                        <InputNumber style={{ width: '33%' }} placeholder="Days"
                            disabled={store.daysDisabled}
                            onChange={daysChanged} />
                    </FormItem>
                </Input.Group>
            </FormItem>
        </>
    )
})

FieldAgev2.propTypes = {
    visible: propTypes.bool.isRequired,
    name: propTypes.string.isRequired,
    form: propTypes.object,
    value: propTypes.object,
}