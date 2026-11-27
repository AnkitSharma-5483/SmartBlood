
"use client";

import { useMemo, useState } from "react";
import StatCard from "@/components/ui/statcard";
import DataTable from "@/components/ui/datatable";
import SearchBar from "@/components/ui/searchbar";
import StatusBadge from "@/components/ui/statusbadge";

import {
  Plus,
  X,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  Building2,
} from "lucide-react";

// Initial demo requests
const initialRequests = [
  {
    id: "REQ-1001",
    patient: "Rahul Das",
    hospital: "City Care Hospital",
    bloodGroup: "O+",
    component: "RBC",
    units: 3,
    date: "2026-11-26",
    priority: "Emergency",
    status: "Pending",
    contact: "9876543210",
  },
  {
    id: "REQ-1002",
    patient: "Priya Singh",
    hospital: "LifeLine Medical Centre",
    bloodGroup: "A+",
    component: "Platelets",
    units: 2,
    date: "2026-11-26",
    priority: "High",
    status: "Approved",
    contact: "9876543211",
  },
  {
    id: "REQ-1003",
    patient: "Amit Roy",
    hospital: "District Hospital",
    bloodGroup: "B+",
    component: "RBC",
    units: 1,
    date: "2026-11-25",
    priority: "Normal",
    status: "Issued",
    contact: "9876543212",
  },
  {
    id: "REQ-1004",
    patient: "Sneha Gupta",
    hospital: "City Care Hospital",
    bloodGroup: "AB+",
    component: "Plasma",
    units: 2,
    date: "2026-11-25",
    priority: "High",
    status: "Pending",
    contact: "9876543213",
  },
  {
    id: "REQ-1005",
    patient: "Arjun Sharma",
    hospital: "Medicare Hospital",
    bloodGroup: "O-",
    component: "RBC",
    units: 2,
    date: "2026-11-24",
    priority: "Emergency",
    status: "Rejected",
    contact: "9876543214",
  },
];

const emptyForm = {
  patient: "",
  hospital: "",
  bloodGroup: "O+",
  component: "RBC",
  units: "1",
  date: "",
  priority: "Normal",
  contact: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100";

const formFields = [
  {
    label: "Patient Name",
    name: "patient",
    type: "text",
    placeholder: "Enter patient name",
    required: true,
  },
  {
    label: "Hospital / Department",
    name: "hospital",
    type: "text",
    placeholder: "Enter hospital name",
    required: true,
  },
  {
    label: "Required Units",
    name: "units",
    type: "number",
    min: "1",
    max: "100",
    required: true,
  },
  {
    label: "Required Date",
    name: "date",
    type: "date",
    required: true,
  },
  {
    label: "Contact Number",
    name: "contact",
    type: "tel",
    pattern: "[0-9]{10}",
    placeholder: "10-digit mobile number",
    required: true,
  },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Statistics
  const pendingCount = requests.filter(
    (r) => r.status === "Pending"
  ).length;

  const emergencyCount = requests.filter(
    (r) =>
      r.priority === "Emergency" &&
      r.status !== "Issued" &&
      r.status !== "Rejected"
  ).length;

  const approvedCount = requests.filter(
    (r) => r.status === "Approved"
  ).length;

  // Count actual units issued, not issued requests
  const issuedUnits = requests
    .filter((r) => r.status === "Issued")
    .reduce((total, r) => total + r.units, 0);

  const stats = [
    {
      title: "Total Requests",
      value: requests.length,
      change: "All recorded requests",
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Pending Requests",
      value: pendingCount,
      change: "Awaiting approval",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Emergency Requests",
      value: emergencyCount,
      change: "Require urgent attention",
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Units Issued",
      value: issuedUnits,
      change: `${approvedCount} requests approved`,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  // Search and filters
  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        request.id.toLowerCase().includes(searchText) ||
        request.patient.toLowerCase().includes(searchText) ||
        request.hospital.toLowerCase().includes(searchText) ||
        request.bloodGroup.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        request.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, search, statusFilter, priorityFilter]);

  // Update form
  function updateForm(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Close modal and reset form
  function closeModal() {
    setShowModal(false);
    setForm(emptyForm);
  }

  // Add new request
  function addRequest(event) {
    event.preventDefault();

    const newRequest = {
      ...form,
      id: `REQ-${Date.now().toString().slice(-6)}`,
      units: Number(form.units),
      status: "Pending",
    };

    setRequests((previous) => [newRequest, ...previous]);
    closeModal();
  }

  // Update request status
  function updateStatus(id, status) {
    setRequests((previous) =>
      previous.map((request) =>
        request.id === id ? { ...request, status } : request
      )
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-800 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-rose-600">
              Blood Bank Management
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Blood Requests
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage hospital blood requirements and track request progress.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            <Plus size={18} />
            Create Request
          </button>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              change={item.change}
              icon={item.icon}
              color={item.color}
              bg={item.bg}
            />
          ))}
        </section>

        {/* Emergency notice */}
        {emergencyCount > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle
              className="mt-0.5 shrink-0 text-red-600"
              size={20}
            />

            <div>
              <p className="font-semibold text-red-800">
                Emergency requests need attention
              </p>

              <p className="mt-1 text-sm text-red-700">
                There are {emergencyCount} active emergency request(s).
                Review their availability and priority before processing.
              </p>
            </div>
          </div>
        )}

        {/* Requests table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Table header and filters */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Request Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search, filter and update blood requests.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search requests..."
                className="sm:w-56 sm:flex-none"
                inputClassName="rounded-xl focus:border-rose-400 focus:ring-rose-100"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-400"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Issued">Issued</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-rose-400"
              >
                <option value="All">All priorities</option>
                <option value="Emergency">Emergency</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <DataTable
            columns={[
              "Request ID",
              "Patient / Hospital",
              "Blood Required",
              "Units",
              "Request Date",
              "Priority",
              "Status",
              "Action",
            ]}
            data={filteredRequests}
            minWidth="1050px"
            emptyMessage={
              <div className="py-4 text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 font-semibold text-slate-700">
                  No requests found
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            }
            renderRow={(request) => (
              <tr
                key={request.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <span className="font-semibold text-slate-800">
                    {request.id}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-800">
                    {request.patient}
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Building2 size={13} />
                    {request.hospital}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                      <Droplet size={17} />
                    </span>

                    <div>
                      <p className="font-bold text-slate-800">
                        {request.bloodGroup}
                      </p>

                      <p className="text-xs text-slate-500">
                        {request.component}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 font-semibold">
                  {request.units} units
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {request.date}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={request.priority} />
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={request.status} />
                </td>

                <td className="px-5 py-4">
                  {request.status === "Pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStatus(request.id, "Approved")}
                        className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(request.id, "Rejected")}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </div>
                  ) : request.status === "Approved" ? (
                    <button
                      onClick={() => updateStatus(request.id, "Issued")}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Mark Issued
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">
                      No action
                    </span>
                  )}
                </td>
              </tr>
            )}
          />

          <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>
        </div>

        {/* Create request modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
            <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

              {/* Modal header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Create Blood Request
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the patient's blood requirement details.
                  </p>
                </div>

                <button
                  onClick={closeModal}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={addRequest} className="space-y-5 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {formFields.map((field) => (
                    <FormField
                      key={field.name}
                      label={field.label}
                    >
                      <input
                        {...field}
                        {...(field.name === "date"
                          ? {
                              min: new Date().toISOString().split("T")[0],
                            }
                          : {})}
                        value={form[field.name]}
                        onChange={(e) =>
                          updateForm(field.name, e.target.value)
                        }
                        className={inputClass}
                      />
                    </FormField>
                  ))}

                  {/* Blood Group */}
                  <FormField label="Blood Group">
                    <select
                      value={form.bloodGroup}
                      onChange={(e) =>
                        updateForm("bloodGroup", e.target.value)
                      }
                      className={inputClass}
                    >
                      {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                        (group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        )
                      )}
                    </select>
                  </FormField>

                  {/* Blood Component */}
                  <FormField label="Blood Component">
                    <select
                      value={form.component}
                      onChange={(e) =>
                        updateForm("component", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option>RBC</option>
                      <option>Platelets</option>
                      <option>Plasma</option>
                    </select>
                  </FormField>

                  {/* Priority */}
                  <FormField label="Priority">
                    <select
                      value={form.priority}
                      onChange={(e) =>
                        updateForm("priority", e.target.value)
                      }
                      className={inputClass}
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Emergency</option>
                    </select>
                  </FormField>
                </div>

                {/* Form buttons */}
                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          SmartBlood · Blood request management · Demo interface
        </p>
      </div>
    </div>
  );
}

// Reusable form field
function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}
