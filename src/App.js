import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { CssVariables } from '@dhis2/ui'
import React, {useState} from 'react'
import styles from './App.module.css'

import { AlertHandler } from './notifications'
import { Navigation } from './navigation'
import {
    RECEIVED_SMS_LIST_PATH,
    ReceivedSmsList,
    HOME_PATH,
    Home,
} from './views'
import { dataTest } from './dataTest'
import { D2Shim } from '@dhis2/app-runtime-adapter-d2'
// import { getUserSettings } from 'd2'
import 'antd/dist/antd.css';

const appConfig = {
    schemas: [],
  };
  
  const authorization = process.env.REACT_APP_DHIS2_AUTHORIZATION || null;
  if (authorization) {
    appConfig.headers = { Authorization: authorization };
  }

const App = () => {
    return (
        <D2Shim appConfig={appConfig} i18nRoot="./i18n">
            {({ d2 }) => {
                if (!d2) {
                    return null;
                } else {
                    return (
                        <AlertHandler>
                            <CssVariables spacers colors />
                            <HashRouter>
                                <div className={styles.container} data-test={dataTest('app')}>
                                    <div className={styles.sidebar}>
                                        <Navigation />
                                    </div>

                                    <main className={styles.content}>
                                        <Switch>
                                            <Route exact path={HOME_PATH} component={Home} />

                                            {/* View received sms */ ''}
                                            <Route
                                                exact
                                                path={RECEIVED_SMS_LIST_PATH}
                                                component={ReceivedSmsList}
                                            />

                                            <Redirect from="*" to={HOME_PATH} />
                                        </Switch>
                                    </main>
                                </div>
                            </HashRouter>
                        </AlertHandler>
                    )
                }
            }}
        </D2Shim>
    )
              
    
}
export default App
