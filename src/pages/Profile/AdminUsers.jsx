import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toRows } from "../../utils/adminUsers";
import UsersList from "../../components/admin/UsersList";
import GiftGroups from "../../components/admin/GiftGroups";
import UserDetail from "../../components/admin/UserDetail";
import "./admin-users.css";

const TABS = [["lista", "Lista"], ["dones", "Por don principal"]];

/** Vista admin del perfil: pestañas Lista / Por don + detalle en ventana. */
export default function AdminUsers({ profiles }) {
  const rows = useMemo(() => toRows(profiles), [profiles]);
  const [tab, setTab] = useState("lista");
  const [openUid, setOpenUid] = useState(null);
  const opened = rows.find((r) => r.uid === openUid)?.profile ?? null;

  return (
    <>
      <div className="adm-tabs" role="tablist">
        {TABS.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{label}</button>
        ))}
        <Link to="/seguimiento" className="adm-tab-link">Seguimiento y red →</Link>
      </div>
      {tab === "lista" ? <UsersList rows={rows} onOpen={setOpenUid} /> : <GiftGroups rows={rows} onOpen={setOpenUid} />}
      <UserDetail profile={opened} onClose={() => setOpenUid(null)} />
    </>
  );
}
