import React, { useState } from "react";
import AdminAddStatusBadge from "../components/status/AdminAddStatusBadge";
import StatusPreview from "../components/status/StatusPreview";
import StatusUserList from "../components/status/StatusUserList";
import { useSelector } from "react-redux";
import AdminStatusCard from "../components/status/AdminStatusCard";
import SeenUserStatus from "../page/SeenUserStatus";

function StatusScreen() {
  const { statusPreview, adminStatus, selectedUser } = useSelector(
    (state) => state.status,
  );

  const previewAvailable = Object.entries(statusPreview).length;


  return (
    <>
      <div className={`flex h-screen w-full relative bg-[#fff]`}>
        <StatusUserList />

        {previewAvailable > 0 ? (
          <StatusPreview />
        ) : (
          <main
            className={`flex-1 bg-[#f6f7f7] flex flex-col items-start   ${previewAvailable > 0 && "blur-lg"}`}
          >
            <div className="w-full h-screen flex flex-col">
              <AdminAddStatusBadge />

              <div className="w-full py-2 p-4 mt-2">
                {adminStatus.length > 0 && (
                  <>
                    <h1 className="font-bold my-2">My Statuses</h1>
                    {adminStatus?.map((status) => {
                      return (
                        <AdminStatusCard key={status._id} status={status} />
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </main>
        )}

        {Object.entries(selectedUser).length > 0 && <SeenUserStatus statusData={selectedUser}/>}
      </div>
    </>
  );
}

export default StatusScreen;
