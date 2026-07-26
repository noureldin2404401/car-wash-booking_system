// Mock Data Array for Initial Display
const mockBookings = [
  {
    id: "CW-1001",
    name: "Ahmed Hassan",
    phone: "01012345678",
    vehicle: "Sedan (Toyota)",
    package: "Basic Exterior",
    dateTime: "2026-07-26 10:00 AM",
    status: "Confirmed",
  },
  {
    id: "CW-1002",
    name: "Sarah Ali",
    phone: "01198765432",
    vehicle: "SUV (Kia)",
    package: "VIP Full Detail",
    dateTime: "2026-07-26 11:30 AM",
    status: "Pending",
  },
  {
    id: "CW-1003",
    name: "Mohamed Omar",
    phone: "01234567890",
    vehicle: "Truck (Ford)",
    package: "Deluxe Interior",
    dateTime: "2026-07-25 04:00 PM",
    status: "Completed",
  },
  {
    id: "CW-1004",
    name: "Nour Mahmoud",
    phone: "01055554444",
    vehicle: "Hatchback (Fiat)",
    package: "Basic Exterior",
    dateTime: "2026-07-27 01:00 PM",
    status: "Confirmed",
  },
];

// DOM Elements
const tableBody = document.getElementById("bookingsTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const recordCount = document.getElementById("recordCount");
const noResultsMsg = document.getElementById("noResultsMsg");

// Load Data on Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderTable(mockBookings);
});

// Function to Render Table Rows
function renderTable(data) {
  tableBody.innerHTML = "";
  recordCount.textContent = data.length;

  if (data.length === 0) {
    noResultsMsg.classList.remove("hidden");
    return;
  }

  noResultsMsg.classList.add("hidden");

  data.forEach((booking) => {
    const row = document.createElement("tr");

    // Determine status badge class
    const statusClass = `badge-${booking.status.toLowerCase()}`;

    row.innerHTML = `
      <td><strong>${booking.id}</strong></td>
      <td>${escapeHTML(booking.name)}</td>
      <td>${escapeHTML(booking.phone)}</td>
      <td>${escapeHTML(booking.vehicle)}</td>
      <td>${escapeHTML(booking.package)}</td>
      <td>${booking.dateTime}</td>
      <td><span class="badge ${statusClass}">${booking.status}</span></td>
    `;
    tableBody.appendChild(row);
  });
}

// Search and Filter Logic
function filterData() {
  const query = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  const filtered = mockBookings.filter((booking) => {
    const matchesQuery =
      booking.name.toLowerCase().includes(query) ||
      booking.phone.includes(query);
    const matchesStatus =
      selectedStatus === "ALL" || booking.status === selectedStatus;

    return matchesQuery && matchesStatus;
  });

  renderTable(filtered);
}

// Event Listeners for Dynamic Filtering
searchInput.addEventListener("keyup", filterData);
statusFilter.addEventListener("change", filterData);

// Helper function to prevent XSS output issues
function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        tag
      ] || tag,
  );
}
