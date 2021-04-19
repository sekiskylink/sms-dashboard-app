import { Menu } from '@dhis2/ui'
import React from 'react'

import {
    HOME_PATH,
    HOME_LABEL,
    RECEIVED_SMS_LIST_PATH,
    RECEIVED_SMS_LIST_LABEL,
} from '../views'
import { NavigationItem } from './NavigationItem'
import { dataTest } from '../dataTest'

export const Navigation = () => (
    <Menu dataTest={dataTest('navigation-navigation')}>
        <NavigationItem path={HOME_PATH} label={HOME_LABEL} exactMatch={true} />

        <NavigationItem
            path={RECEIVED_SMS_LIST_PATH}
            label={RECEIVED_SMS_LIST_LABEL}
        />
    </Menu>
)
