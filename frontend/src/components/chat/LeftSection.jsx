import React from "react";
import LeftSidePageBG from "../backgroundPages/LeftSidePageBG";
import ListHeader from "./leftSection/ListHeader";
import UserList from "./leftSection/UserList";
import AdminAddUserModel from "../../model/AdminAddUserModel";

function LeftSection() {
  return (
    <>
      <ListHeader />

      <div className="w-full h-full relative">
        <UserList/>
      </div>
    </>
  );
}

export default LeftSection;
