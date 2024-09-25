import { CssVariables } from "@dhis2/ui";
import React from "react";

import { D2Shim } from "@dhis2/app-runtime-adapter-d2";
import "antd/dist/antd.css";
import { MainRoutes } from "./Routes";
import Store from "./Store";
import { Provider } from "./context/context";
import { AlertHandler } from "./notifications";

const appConfig = {
  schemas: ["organisationUnits", "userGroups"],
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
          const store = new Store(d2);

          return (
            <Provider value={store}>
              <AlertHandler>
                <CssVariables spacers colors />

                <MainRoutes />
              </AlertHandler>
            </Provider>
          );
        }
      }}
    </D2Shim>
  );
};
export default App;
