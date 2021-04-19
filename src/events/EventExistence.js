import propTypes from 'prop-types'
import { useReadEventQuery } from './useReadEventQuery'
import styles from './Events.module.css'

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
        <span className={styles.dot}></span>&nbsp;
        </>
    )
}

EventExists.propTypes = {
    id: propTypes.string.isRequired
}
