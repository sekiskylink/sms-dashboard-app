import React, { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { PropTypes } from "@dhis2/prop-types";
import i18n from "@dhis2/d2-i18n";
import debounce from "lodash.debounce";
import { orderBy } from "lodash";
import { dataTest } from "../../dataTest";
import { Button, Select } from "antd";
import { useQueryParams } from "./useQueryParams";
import { createSearchString } from "../../utils";
import { observer } from "mobx-react-lite";
import { useStore } from "../../context/context";
import { eventConfs } from "../../events";
import styles from "./Filter.module.css";
import { useReadMeQuery } from "../../orgUnit/useReadMeQuery";

const { Option } = Select;

const userDistricts = (ou) => {
  return ou.flatMap((o) => {
    if (o.level === 2) {
      return o.children;
    } else if (o.level === 1) {
      return o.children.flatMap(({ children }) => {
        return children;
      });
    } else if (o.level === 3) {
      // Check if the name matches the targetName
      if (o.displayName === "Kampala District") {
        // Return both the district (displayName and id) and its children
        return [
          { displayName: o.displayName, id: o.id },
          ...o.children.map((child) => ({
            displayName: child.displayName,
            id: child.id
          }))
        ];
      } else {
        // Return only the district if the name doesn't match
        return [{ displayName: o.displayName, id: o.id }];
      }
    } else if (o.level === 4) {
      return [{ displayName: o.displayName, id: o.id }];
    }
    return [];
  });
};

const DistrictFieldSelect = observer(() => {
  const store = useStore();
  const history = useHistory();
  const { pageSize, orgUnit } = useQueryParams(store.searchOrgUnit);

  const handleOrgUnitChange = (selected) => {
    store.setSearchOrgUnit(selected);
    history.push({
      search: createSearchString({
        orgUnit: selected,
        pageSize,
        page: 1,
      }),
    });
  };
  const { loading, error, data, success } = useReadMeQuery();
  if (loading) {
    return <Select placeholder={i18n.t("Select District")}></Select>;
  }
  if (error) {
    return <Select placeholder={i18n.t("Select District")}></Select>;
  }
  if (data && data.me !== undefined) {
    const { organisationUnits } = data.me;
    const orgUnits = userDistricts(organisationUnits);

    const districtsOptions = store.districts.map((d) => (
      <Option key={d.id} label={d.displayName} value={d.id}>
        {d.displayName}
      </Option>
    ));

    const userOrgUnitsOptions = orderBy(orgUnits, "displayName", "asc")
      .filter((o) => {
        if (o !== undefined) {
          return o;
        }
      })
      .map((d) => (
        <Option key={d.id} label={d.displayName} value={d.id}>
          {d.displayName}
        </Option>
      ));

    // const userOrgUnitsOptions = store.userOrgUnits.map((d) => (
    //     <Option key={d.id} label={d.displayName} value={d.id}>{d.displayName}</Option>))

    return (
      <Select
        label={i18n.t("Filter by District")}
        style={{ width: "250px" }}
        onChange={handleOrgUnitChange}
        placeholder={"Select District"}
        size={"large"}
        className={styles.filter}
        selected={store.defaultOrgUnit}
      >
        {/* {store.IsGlobalUser ?
                <Option key={eventConfs.nationalOrgUnit}
                    value={eventConfs.nationalOrgUnit} label={"National"}>National
                </Option> : userOrgUnitsOptions
            }    */}

        {/*
                <Option key={store.defaultOrgUnit}
                    value={store.defaultOrgUnit} label={"My OrganisationUnit"}>My OrganisationUnit
                </Option>
            */}
        {userOrgUnitsOptions}
        {store.IsGlobalUser && districtsOptions}
      </Select>
    );
  }
  return <Select placeholder={i18n.t("Select District")}></Select>;
});

const Filter = observer(() => {
  const store = useStore();
  const { pageSize, orgUnit } = useQueryParams(store.searchOrgUnit);
  const history = useHistory();

  const handleReset = () => {
    history.push({
      search: createSearchString({
        pageSize,
        page: 1,
      }),
    });
  };

  return (
    <div
      data-test={dataTest("views-events-filter")}
      className={styles.container}
    >
      <div className={styles.inputStrip}>
        <DistrictFieldSelect />
        {/* <Button large onClick={handleReset} dataTest="reset-filter-btn">
                    {i18n.t('Reset filter')}
                </Button> */}
        <Button onClick={handleReset} size={"large"}>
          {i18n.t("Reset filter")}
        </Button>
      </div>
    </div>
  );
});

export { Filter };
