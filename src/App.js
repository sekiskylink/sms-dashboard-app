import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { CssVariables } from '@dhis2/ui'
import React from 'react'
import styles from './App.module.css'

import { AlertHandler } from './notifications'
import { Navigation } from './navigation'
import {
    RECEIVED_SMS_LIST_PATH,
    ReceivedSmsList,
    ReceivedEventsList,
    HOME_PATH,
    Home,
    RECEIVED_ALERTS_PATH,
} from './views'
import {MainRoutes} from './Routes'
import { dataTest } from './dataTest'
import { D2Shim } from '@dhis2/app-runtime-adapter-d2'
import { Provider } from "./context/context"
import 'antd/dist/antd.css';
import Store from './Store'

const appConfig = {
    schemas: [
        'organisationUnits',
        'userGroups'
    ],
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
                    const store = new Store(d2)
                    
                    return (
                        <Provider value={store}>
                        <AlertHandler>
                            <CssVariables spacers colors />

                            <MainRoutes/>

                        </AlertHandler>
                        </Provider>
                    )
                }
            }}
        </D2Shim>
    )
              
    
}
export default App
