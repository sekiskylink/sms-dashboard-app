// import {PeriodDimension} from '@dhis2/analytics'
import { useState } from 'react'
import {Modal, Button, Select} from 'antd'
import i18n from '../../locales'

const {Option} = Select

export const PeriodDialog = () => {
    const [selectedPeriods, setSelectedPeriods] = useState([])
    const [open, setOpen] = useState(false)

    const showModal = () => {
        setOpen(true)
    }

    const closeModal = () => {
        setOpen(false)
    }

    const handleOk = () => {

    }

    const onSelect = ({items}) => {
        setSelectedPeriods(items)
    }

    return (
        <>
            <Button type="default" onClick={showModal}>
                {i18n.t(' Select Period')}
            </Button>
            <Modal title="Period Selector" visible={open} onOk={handleOk} onCancel={closeModal}>
                {/* <PeriodDimension selectedPeriods={selectedPeriods} onSelect={onSelect} /> */}
                <Select>
                </Select>
            </Modal>

        </>
    )
}