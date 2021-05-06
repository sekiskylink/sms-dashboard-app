import propTypes from 'prop-types'
import { useReadEventQuery } from './useReadEventQuery'
import {ForwardOutlined} from '@ant-design/icons'

export const EventExists = ({id}) => {
    const { loading, error, data } = useReadEventQuery(id)
    if(loading){
        return (
            <span></span>
        )
    }

    if (error) {
        return (
            <span></span>
        )
    }

    return (
        <>
        <ForwardOutlined />
        </>
    )
}

EventExists.propTypes = {
    id: propTypes.string.isRequired
}
