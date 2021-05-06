import propTypes from 'prop-types'
import { useReadEventQuery } from './useReadEventQuery'
import { EventDialog } from './EventDialog'
import { ForwardOutlined } from '@ant-design/icons'

export const EventModalButton = ({ message }) => {
    const { loading, error, data } = useReadEventQuery(message.id)
    if (loading) {
        return (
            <span></span>
        )
    }

    return (!!data && data.event ?

        <EventDialog message={message} forUpdate={1} /> :

        <EventDialog message={message} forUpdate={0} />
    )
}

EventModalButton.propTypes = {
    message: propTypes.any.isRequired
}