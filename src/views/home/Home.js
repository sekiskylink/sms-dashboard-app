import React from 'react'
import i18n from '../../locales'
import { PageHeadline } from '../../headline'
import { dataTest } from '../../dataTest'
import {
    GATEWAY_CONFIG_LIST_PATH,
    RECEIVED_SMS_LIST_PATH,
} from '../'
import s from './Home.module.css'
import HomeCard from './HomeCard'

export const HOME_PATH = '/'
export const HOME_LABEL = 'Overview'

export const Home = () => {
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
            </div>
        </div>
    )
}
