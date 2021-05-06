import { Menu } from '@dhis2/ui'
import React from 'react'

import {
    HOME_PATH,
    HOME_LABEL,
    RECEIVED_SMS_LIST_PATH,
    RECEIVED_SMS_LIST_LABEL,
    RECEIVED_ALERTS_PATH,
    RECEIVED_ALERTS_LABEL,
    VISUALIZATIONS_PATH,
    VISUALIZATIONS_LABEL
} from '../views'
import {useStore} from '../context/context'
import { observer } from 'mobx-react-lite'
import { NavigationItem } from './NavigationItem'
import { dataTest } from '../dataTest'

const LABLE_FORWARDED = 'Forwarded '
export const Navigation = observer(() => {
    const store = useStore()
    const forwarded = store.IsGlobalUser ? LABLE_FORWARDED : ''
    return (
        <Menu dataTest={dataTest('navigation-navigation')}>
            <NavigationItem path={HOME_PATH} label={HOME_LABEL} exactMatch={true} />
            { store.IsGlobalUser &&
                <NavigationItem
                    path={RECEIVED_SMS_LIST_PATH}
                    label={RECEIVED_SMS_LIST_LABEL}
                />
            }

            <NavigationItem
                path={RECEIVED_ALERTS_PATH}
                label={forwarded + RECEIVED_ALERTS_LABEL}
            />
            {/*
            <NavigationItem
                path={VISUALIZATIONS_PATH}
                label={VISUALIZATIONS_LABEL}
            />
            */}
        </Menu>
    )
})
