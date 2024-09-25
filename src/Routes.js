import React, { useEffect, useState } from "react";
import { CenteredContent, CircularLoader } from "@dhis2/ui";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import styles from "./App.module.css";
import { Navigation } from "./navigation";
import {
  RECEIVED_SMS_LIST_PATH,
  ReceivedSmsList,
  ReceivedEventsList,
  HOME_PATH,
  Home,
  RECEIVED_ALERTS_PATH,
  Visualizations,
  VISUALIZATIONS_PATH,
} from "./views";
import { dataTest } from "./dataTest";
import { useStore } from "./context/context";
import { observer } from "mobx-react-lite";

export const MainRoutes = observer(() => {
  const store = useStore();

  useEffect(() => {
    store.fetchDefaults();
  }, [store]);

  // console.log("XXXXXXXXXXXXX", store.IsGlobalUser)
  // console.log("YYYYYYYYYYYYY>", store.districts)
  if (store.loading || store.filteringOrgUnit === '') {
    return (
      <CenteredContent>
        <CircularLoader />
      </CenteredContent>
    );
  } else {
    return (
      <HashRouter>
        <div className={styles.container} data-test={dataTest("app")}>
          <div className={styles.sidebar}>
            <Navigation />
          </div>

          <main className={styles.content}>
            <Switch>
              <Route exact path={HOME_PATH} component={Home} />
              {store.IsGlobalUser && (
                <Route
                  exact
                  path={RECEIVED_SMS_LIST_PATH}
                  component={ReceivedSmsList}
                />
              )}
              <Route
                exact
                path={RECEIVED_ALERTS_PATH}
                component={ReceivedEventsList}
              />
              <Route
                exact
                path={VISUALIZATIONS_PATH}
                component={Visualizations}
              />

              <Redirect from="*" to={HOME_PATH} />
            </Switch>
          </main>
        </div>
      </HashRouter>
    );
  }
});
