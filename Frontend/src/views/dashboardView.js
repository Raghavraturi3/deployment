// Dashboard View Module - Geospatial Operations Console
// Real-time telemetry and Digital Twin synchronization for Antarctic Base Alpha
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export function renderDashboardView(telemetryEngine, onOpenCopilot, authService) {
  const container = document.createElement('div');
  container.className = 'content-body';

  const state = telemetryEngine.getState();
  const isAdmin = authService && authService.hasRole('ADMIN');

  container.innerHTML = `
    <!-- PAGE HEADER -->
    <div class="page-title-bar">
      <div>
        <h1 class="page-heading">Base Operations Overview</h1>
        <p class="page-subheading">Real-time telemetry and Digital Twin synchronization for Antarctic Base Alpha</p>
      </div>
      <div class="page-actions">
        ${isAdmin ? `
          <button class="btn btn-primary btn-sm" id="btn-hero-ai-copilot" title="Open Antarctic AI Voice Copilot (Admin Only)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
            <span>AI COPILOT</span>
          </button>
        ` : ''}
        <button class="btn btn-secondary btn-sm" id="btn-refresh-dash">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Refresh Feed</span>
        </button>
      </div>
    </div>

    <!-- MISSION CONTROL HERO STATUS CARD -->
    <div class="card card-dark">
      <div class="card-header">
        <div>
          <div class="card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Antarctic Mission Control & Polar Microgrid</span>
          </div>
          <div class="card-subtitle">Autonomous life support, microgrid telemetry & satellite downlink active</div>
        </div>
        <div>
          <span class="badge badge-success">
            <span class="status-dot"></span> 99.98% TELEMETRY SYNC
          </span>
        </div>
      </div>
      <div class="card-body">
        <div class="dark-stat-grid">
          <div class="dark-stat-item">
            <span class="dark-stat-label">Total Microgrid Load</span>
            <span class="dark-stat-val" id="dark-stat-power">${state.kpis.powerKw} kW</span>
            <span class="dark-stat-tag mono-num" style="color:var(--accent-signal);">79% UTILIZATION</span>
          </div>

          <div class="dark-stat-item">
            <span class="dark-stat-label">Ambient Polar Temp</span>
            <span class="dark-stat-val" id="dark-stat-temp">${state.kpis.tempAmbient} °C</span>
            <span class="dark-stat-tag mono-num" style="color:var(--text-secondary);">WINDCHILL ${state.kpis.windChill}°C</span>
          </div>

          <div class="dark-stat-item">
            <span class="dark-stat-label">Active Station Personnel</span>
            <span class="dark-stat-val">${state.kpis.activePersonnel} Crew</span>
            <span class="dark-stat-tag mono-num" style="color:var(--sev-confirmed);">4 FIELD TEAMS</span>
          </div>

          <div class="dark-stat-item">
            <span class="dark-stat-label">Active Incidents</span>
            <span class="dark-stat-val" id="dark-stat-alerts">${state.kpis.activeAlertsCount} Active</span>
            <span class="dark-stat-tag mono-num" style="color:var(--sev-emergency);">P1 TRIAGE</span>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI METRIC CARDS -->
    <div class="kpi-grid">
      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Station Microgrid</span>
          <div class="kpi-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" id="kpi-power-val">${state.kpis.powerKw} kW</span>
          <span class="kpi-trend positive">↑ 2.4%</span>
        </div>
        <div class="kpi-subtext">Capacity: <span class="mono-num">${state.kpis.powerCapacityKw} kW</span></div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Ambient Base Temp</span>
          <div class="kpi-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" id="kpi-temp-val">${state.kpis.tempAmbient} °C</span>
          <span class="kpi-trend negative">↓ -1.2°</span>
        </div>
        <div class="kpi-subtext">Windchill Factor: <span class="mono-num">${state.kpis.windChill} °C</span></div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Active Station Staff</span>
          <div class="kpi-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value">${state.kpis.activePersonnel} On-Site</span>
          <span class="kpi-trend neutral">Max 60</span>
        </div>
        <div class="kpi-subtext">4 Outpost Expeditions</div>
      </div>

      <div class="card kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Active Incident Alerts</span>
          <div class="kpi-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
        </div>
        <div class="kpi-value-row">
          <span class="kpi-value" id="kpi-alert-val">${state.kpis.activeAlertsCount} Active</span>
          <span class="kpi-trend warning">P1 Priority</span>
        </div>
        <div class="kpi-subtext">1 High / 2 Medium Severity</div>
      </div>
    </div>

    <!-- DIGITAL TWIN MAP & TELEMETRY CHART GRID -->
    <div class="grid-2-1">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>Antarctic Base Spatial Digital Twin</span>
            </div>
            <div class="card-subtitle">Real-time module status nodes across polar sector layout</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-reset-map">Center Camera</button>
        </div>
        <div class="card-body" style="padding: 0;">
          <div class="map-canvas-container">
            <canvas id="dash-twin-canvas" class="map-canvas"></canvas>
            <div class="map-overlay-controls">
              <button class="map-btn active">Thermal</button>
              <button class="map-btn">Power Grid</button>
              <button class="map-btn">Structural</button>
            </div>
            <div class="map-legend">
              <div class="legend-item"><span class="legend-color" style="background:var(--sev-confirmed);"></span> Normal (Habitation)</div>
              <div class="legend-item"><span class="legend-color" style="background:var(--sev-probable);"></span> Thermal Warning</div>
              <div class="legend-item"><span class="legend-color" style="background:var(--accent-signal);"></span> Telemetry Active</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">24h Microgrid Power Output</div>
            <div class="card-subtitle">Solar PV vs Wind vs Backup Fuel Cells</div>
          </div>
        </div>
        <div class="card-body">
          <div style="height: 310px; position: relative;">
            <canvas id="dash-power-chart"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- EXPEDITION ROUTES & ACTIVE CONVOYS COMMAND SUMMARY -->
    <div class="card" style="border-left: 3px solid var(--accent-signal);">
      <div class="card-header" style="justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
          <div>
            <div class="card-title">Expedition Routes & Convoy Intelligence</div>
            <div class="card-subtitle">Active scientific traverses and corridor risk monitoring across Maitri & Bharati</div>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <span class="badge badge-warning">03 routes require review</span>
          <a href="#expeditions" class="btn btn-primary btn-sm">
            <span>Open Route Intelligence</span>
            <span>→</span>
          </a>
        </div>
      </div>
      <div class="card-body">
        <div class="grid-3" style="gap:10px;">
          <div style="background:var(--bg-subtle); border:1px solid var(--line-subtle); border-radius:var(--radius-xs); padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:12.5px; font-weight:700; color:var(--accent-signal); font-family:var(--font-mono);">M-03 Wohlthat Survey</div>
              <div style="font-size:11px; color:var(--text-secondary);">Maitri → Field Site A (42.6 km)</div>
            </div>
            <span class="badge badge-warning">CAUTION</span>
          </div>
          <div style="background:var(--bg-subtle); border:1px solid var(--line-subtle); border-radius:var(--radius-xs); padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:12.5px; font-weight:700; color:var(--accent-signal); font-family:var(--font-mono);">B-02 Ship-to-Station</div>
              <div style="font-size:11px; color:var(--text-secondary);">Bharati → Prydz Mooring (11.2 km)</div>
            </div>
            <span class="badge badge-success">NORMAL</span>
          </div>
          <div style="background:var(--bg-subtle); border:1px solid var(--line-subtle); border-radius:var(--radius-xs); padding:8px 12px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:12.5px; font-weight:700; color:var(--accent-signal); font-family:var(--font-mono);">M-05 Willy Field Evac</div>
              <div style="font-size:11px; color:var(--text-secondary);">Maitri Glacier Traverse (28.5 km)</div>
            </div>
            <span class="badge badge-danger">REVIEW REQUIRED</span>
          </div>
        </div>
      </div>
    </div>

    <!-- LIVE INCIDENTS FEED TABLE -->
    <div class="card">
      <div class="card-header">
        <div>
          <div class="card-title">Recent Telemetry Incidents & Alerts</div>
          <div class="card-subtitle">Triaged by station autonomous monitoring algorithms</div>
        </div>
        <a href="#alerts" class="btn btn-secondary btn-sm" id="btn-view-all-alerts">View Triage Board</a>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Incident ID</th>
              <th>Description</th>
              <th>Sector Location</th>
              <th>Severity</th>
              <th>Timestamp</th>
              <th>Assignee</th>
              <th style="text-align:right;">Action</th>
            </tr>
          </thead>
          <tbody id="dash-incidents-tbody">
            ${state.incidents.map(inc => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 700; color: var(--accent-signal);">${inc.id}</td>
                <td style="font-weight: 600;">${inc.title}</td>
                <td>${inc.sector}</td>
                <td>
                  <span class="badge ${inc.severity === 'HIGH' ? 'badge-danger' : inc.severity === 'MEDIUM' ? 'badge-warning' : 'badge-info'}">
                    ${inc.severity}
                  </span>
                </td>
                <td style="color: var(--text-muted); font-size: 11.5px; font-family: var(--font-mono);">${inc.timestamp}</td>
                <td>${inc.assignee}</td>
                <td style="text-align:right;">
                  <a href="#alerts" class="btn btn-secondary btn-sm btn-action-inspect" data-id="${inc.id}">Inspect</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  const copilotBtn = container.querySelector('#btn-hero-ai-copilot');
  if (copilotBtn && onOpenCopilot) {
    copilotBtn.addEventListener('click', onOpenCopilot);
  }

  // Initialize Canvas Map & Chart after DOM append
  setTimeout(() => {
    initCanvasMap(container.querySelector('#dash-twin-canvas'), state);
    initPowerChart(container.querySelector('#dash-power-chart'));
  }, 50);

  return container;
}

function initCanvasMap(canvas, state) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  let animFrame;

  function render() {
    ctx.fillStyle = '#080c10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw polar grid background lines (hairline)
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw connecting power bus lines
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.25, canvas.height * 0.4);
    ctx.lineTo(canvas.width * 0.5, canvas.height * 0.3);
    ctx.lineTo(canvas.width * 0.75, canvas.height * 0.55);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw station nodes
    const now = Date.now();
    state.digitalTwinNodes.forEach((node, i) => {
      const nx = (node.x / 700) * canvas.width;
      const ny = (node.y / 400) * canvas.height;

      // Pulse circle
      const pulseRadius = 10 + Math.sin(now / 400 + i) * 3;
      ctx.fillStyle = node.status === 'WARNING' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath();
      ctx.arc(nx, ny, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Core Node
      ctx.fillStyle = node.status === 'WARNING' ? '#f59e0b' : '#10b981';
      ctx.beginPath();
      ctx.arc(nx, ny, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f0f4f8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node Text Label
      ctx.fillStyle = '#f0f4f8';
      ctx.font = '600 11px Plus Jakarta Sans, sans-serif';
      ctx.fillText(node.name, nx + 12, ny + 3);

      // Temp tag
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 10px JetBrains Mono, monospace';
      ctx.fillText(`${node.temp}°C | Load ${node.load}%`, nx + 12, ny + 16);
    });

    animFrame = requestAnimationFrame(render);
  }

  render();
}

function initPowerChart(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
      datasets: [
        {
          label: 'Solar PV Array (kW)',
          data: [20, 25, 45, 62, 54, 42, 48.2],
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          tension: 0.2,
          borderWidth: 2,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 2.5
        },
        {
          label: 'Wind Turbine Array (kW)',
          data: [65, 72, 80, 78, 85, 74, 74.6],
          borderColor: '#00e5ff',
          backgroundColor: 'transparent',
          tension: 0.2,
          borderWidth: 2,
          pointBackgroundColor: '#00e5ff',
          pointRadius: 2.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, color: '#94a3b8', boxWidth: 10, padding: 12 }
        },
        tooltip: {
          backgroundColor: '#15202e',
          titleFont: { family: 'Plus Jakarta Sans', weight: '700' },
          bodyFont: { family: 'JetBrains Mono' },
          padding: 8,
          cornerRadius: 4,
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#64748b' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: { font: { family: 'JetBrains Mono', size: 10 }, color: '#64748b' }
        }
      }
    }
  });
}
