import React, {useEffect} from 'react'
import i18n from '../../locales'
import { PageHeadline } from '../../headline'
import { dataTest } from '../../dataTest'
import { observer } from 'mobx-react-lite'

import s from './Visualizations.module.css'

export const VISUALIZATIONS_PATH = '/visualizations'
export const VISUALIZATIONS_LABEL = 'Visualizations'

export const Visualizations = observer(() => {
    
    return (
        <div data-test={dataTest('views-visualizations')} className={s.container}>
            <PageHeadline>
                {i18n.t('Visualizations', {
                    nsSeparator: '>',
                })}
            </PageHeadline>
            
        </div>
    )
})
