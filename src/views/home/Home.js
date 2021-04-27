import React, {useEffect} from 'react'
import i18n from '../../locales'
import { PageHeadline } from '../../headline'
import { dataTest } from '../../dataTest'
import { observer } from 'mobx-react-lite'
import {useStore} from '../../context/context'
import {
    RECEIVED_SMS_LIST_PATH,
    RECEIVED_ALERTS_PATH
} from '../'
import s from './Home.module.css'
import HomeCard from './HomeCard'
import VisualisationCard from './VisualisationCard'
import { VISUALIZATIONS_PATH } from '../visualizations/Visualizations'

export const HOME_PATH = '/'
export const HOME_LABEL = 'Overview'

export const Home = observer(() => {
    const store = useStore()
    return (
        <div data-test={dataTest('views-home')} className={s.container}>
            <PageHeadline>
                {i18n.t('Overview: SMS Dashboard', {
                    nsSeparator: '>',
                })}
            </PageHeadline>
            <p className={s.explanation}>
                {i18n.t(
                    'View all received surveillence signals and action on them'
                )}
            </p>
            <div className={s.grid}>
                { store.IsGlobalUser &&
                <div className={s.gridItem}>
                    <HomeCard
                        titleText={i18n.t('Received SMS messages')}
                        bodyText={i18n.t(
                            'Open logs of all SMS alerts received by DHIS2.'
                        )}
                        linkText={i18n.t('View all received SMS alerts')}
                        to={RECEIVED_SMS_LIST_PATH}
                    />
                </div>
                }       

                <div className={s.gridItem}>
                    <HomeCard
                        titleText={i18n.t('Forwarded Alerts')}
                        bodyText={i18n.t(
                            'Open all the alerts forwarded to my Organisation Unit'
                        )}
                        linkText={i18n.t('View all my alerts')}
                        to={RECEIVED_ALERTS_PATH}
                    />
                </div>

                <div className={s.gridItem}>
                    <HomeCard
                        titleText={i18n.t('My Visualizations')}
                        bodyText={i18n.t(
                            'view and filter my visualizations'
                        )}
                        linkText={i18n.t('View my Visualizations')}
                        to={VISUALIZATIONS_PATH}
                    />
                </div>

                <div className={s.gridItem}>
                    <VisualisationCard/>
                </div>
            </div>
        </div>
    )
})
