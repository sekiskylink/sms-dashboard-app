import { Select } from "antd";
import React, { useState } from "react";
import { orderBy } from "lodash";
import propTypes from "prop-types";

import i18n from "../locales";
import { useReadMeQuery } from "./useReadMeQuery";
import { useReadOrgUnitsQuery } from "./useReadOrgUnitsQuery";
import { observer } from "mobx-react-lite";
import { useStore } from "../context/context";

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

export const FieldDistrict2 = observer(({ form, name, value }) => {
  const [selected, setSelected] = useState(value);
  const store = useStore();
  if (store.IsGlobalUser) {
    const { loading, error, data } = useReadOrgUnitsQuery();
    if (loading) {
      return <Select placeholder={i18n.t("District")}></Select>;
    }

    if (error) {
      return <Select placeholder={i18n.t("District")}></Select>;
    }
    const { organisationUnits } = data.orgUnits;

    return (
      <Select
        showSearch
        mode="single"
        placeholder={i18n.t("Districts")}
        value={selected}
        onChange={(value) => {
          const fields = form.getFieldsValue();
          fields[name] = value;
          form.setFieldsValue(fields);
          setSelected(value);
        }}
        filterOption={(input, option) => {
          return (
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          );
        }}
      >
        {orderBy(organisationUnits, "displayName", "asc").map((d) => (
          <Option key={d.id} value={d.id}>
            {d.displayName}
          </Option>
        ))}
      </Select>
    );
  } else {
    console.log("User is NOT Global!!!!");
    const { loading, error, data } = useReadMeQuery();
    if (loading) {
      return <Select placeholder={i18n.t("District")}></Select>;
    }

    if (error) {
      return <Select placeholder={i18n.t("District")}></Select>;
    }
    const { organisationUnits } = data.me;
    // console.log("USER OUs", organisationUnits);
    const districts = userDistricts(organisationUnits);

    return (
      <Select
        showSearch
        mode="single"
        placeholder={i18n.t("Districts")}
        value={selected}
        onChange={(value) => {
          const fields = form.getFieldsValue();
          fields[name] = value;
          form.setFieldsValue(fields);
          setSelected(value);
        }}
        filterOption={(input, option) => {
          return (
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          );
        }}
      >
        {orderBy(districts, "displayName", "asc").map((d) => {
          return (
            <Option key={d.id} value={d.id}>
              {d.displayName}
            </Option>
          );
        })}
      </Select>
    );
  }
});

FieldDistrict2.propTypes = {
  name: propTypes.string.isRequired,
  value: propTypes.string,
};
