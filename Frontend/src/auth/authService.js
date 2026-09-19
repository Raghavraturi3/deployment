
import { apiFetch } from '../api.js';

const SESSION_KEY = 'ao_user_session';

export class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    this.subscribers = [];

    this.routePermissions = {
      dashboard: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'MEDICAL', 'COMMUNICATION', 'OPERATIONS']
      },
      help: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'MEDICAL', 'COMMUNICATION', 'OPERATIONS']
      },
      settings: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'MEDICAL', 'COMMUNICATION', 'OPERATIONS']
      },

      tracking: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'LOGISTICS', 'OPERATIONS', 'RESEARCH', 'INFRASTRUCTURE', 'ENVIRONMENT']
      },
      liveTracking: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'LOGISTICS', 'OPERATIONS', 'RESEARCH', 'INFRASTRUCTURE', 'ENVIRONMENT']
      },
      expeditions: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'LOGISTICS', 'OPERATIONS', 'RESEARCH', 'INFRASTRUCTURE', 'ENVIRONMENT']
      },
      routeIntelligence: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'LOGISTICS', 'OPERATIONS', 'RESEARCH', 'INFRASTRUCTURE', 'ENVIRONMENT']
      },

      energy: {
        roles: ['ADMIN'],
        depts: ['ALL', 'ENERGY']
      },
      logistics: {
        roles: ['ADMIN'],
        depts: ['ALL', 'LOGISTICS']
      },
      logisticsCommand: {
        roles: ['ADMIN'],
        depts: ['ALL', 'LOGISTICS']
      },
      infrastructure: {
        roles: ['ADMIN'],
        depts: ['ALL', 'INFRASTRUCTURE']
      },
      digitalTwin: {
        roles: ['ADMIN'],
        depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'OPERATIONS']
      },
      environment: {
        roles: ['ADMIN'],
        depts: ['ALL', 'ENVIRONMENT', 'RESEARCH']
      },
      envMonitoring: {
        roles: ['ADMIN'],
        depts: ['ALL', 'ENVIRONMENT', 'RESEARCH']
      },
      research: {
        roles: ['ADMIN'],
        depts: ['ALL', 'RESEARCH', 'ENVIRONMENT']
      },

      inventory: {
        roles: ['ADMIN'],
        depts: ['ALL', 'LOGISTICS', 'OPERATIONS']
      },
      maintenance: {
        roles: ['ADMIN'],
        depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'OPERATIONS']
      },
      alerts: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'OPERATIONS']
      },
      personnel: {
        roles: ['ADMIN'],
        depts: ['ALL', 'OPERATIONS']
      },
      roles: {
        roles: ['ADMIN'],
        depts: ['ALL']
      },
      reports: {
        roles: ['ADMIN', 'EMPLOYEE'],
        depts: ['ALL', 'INFRASTRUCTURE', 'ENERGY', 'LOGISTICS', 'ENVIRONMENT', 'RESEARCH', 'OPERATIONS']
      }
    };

    try {
      const cached = localStorage.getItem(SESSION_KEY);

      if (cached) {
        const parsed = JSON.parse(cached);

        this.user = parsed.user || null;
        this.token = parsed.token || null;
        this.isAuthenticated = !!this.user && !!this.token;
      }
    } catch {
      this.clearSession();
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async parseResponse(res) {
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return res.json();
    }

    const text = await res.text();

    if (!res.ok) {
      throw new Error(
        `Server returned HTTP ${res.status}. Check the backend URL and API route.`
      );
    }

    throw new Error(
      'The server returned a non-JSON response. Check the backend API configuration.'
    );
  }

  subscribe(callback) {
    this.subscribers.push(callback);

    return () => {
      this.subscribers = this.subscribers.filter(
        cb => cb !== callback
      );
    };
  }

  notify() {
    this.subscribers.forEach(callback => {
      callback(this.user, this.isAuthenticated);
    });
  }

  async restoreSession() {
    if (!this.token) {
      this.clearSession();
      return null;
    }

    try {
      const res = await apiFetch('/api/auth/me', {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      const data = await this.parseResponse(res);

      if (!res.ok || !data.success || !data.user) {
        this.clearSession();
        this.notify();
        return null;
      }

      this.user = data.user;
      this.isAuthenticated = true;

      this.persist();
      this.notify();

      return this.user;
    } catch (error) {
      console.error('Session restore failed:', error);
      return null;
    }
  }

  async login(identifier, password) {
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          identifier,
          password
        })
      });

      const data = await this.parseResponse(res);

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || 'Login failed. Please check your credentials.'
        );
      }

      if (!data.user || !data.token) {
        throw new Error('Login response did not include a user and token.');
      }

      this.user = data.user;
      this.token = data.token;
      this.isAuthenticated = true;

      this.persist();
      this.notify();

      return this.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }

    this.clearSession();
    this.notify();
  }

  async updateProfile(profileData) {
    const res = await apiFetch('/api/auth/profile', {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(profileData)
    });

    const result = await this.parseResponse(res);

    if (!res.ok || !result.success) {
      throw new Error(result.message || 'Failed to update profile.');
    }

    this.user = result.user;

    this.persist();
    this.notify();

    return this.user;
  }

  persist() {
    try {
      if (this.user && this.token) {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            user: this.user,
            token: this.token
          })
        );
      }
    } catch (error) {
      console.error('Unable to save session:', error);
    }
  }

  clearSession() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;

    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Storage may be unavailable.
    }
  }

  hasRole(role) {
    if (!this.user) return false;
    return this.user.role === role;
  }

  hasDepartment(dept) {
    if (!this.user) return false;

    if (
      this.user.role === 'ADMIN' ||
      this.user.department === 'ALL'
    ) {
      return true;
    }

    return this.user.department === dept;
  }

  hasPermission(permissionKey) {
    if (!this.user) return false;

    if (
      this.user.role === 'ADMIN' ||
      this.user.permissions?.includes('admin.all')
    ) {
      return true;
    }

    return (
      Array.isArray(this.user.permissions) &&
      this.user.permissions.includes(permissionKey)
    );
  }

  canAccessRoute(routeId) {
    if (!this.isAuthenticated || !this.user) {
      return false;
    }

    if (
      this.user.role === 'ADMIN' ||
      this.user.department === 'ALL'
    ) {
      return true;
    }

    const rule = this.routePermissions[routeId];

    // Unknown routes are denied by default.
    if (!rule) {
      return false;
    }

    if (
      rule.roles &&
      !rule.roles.includes(this.user.role)
    ) {
      return false;
    }

    if (
      rule.depts &&
      !rule.depts.includes(this.user.department) &&
      !rule.depts.includes('ALL')
    ) {
      return false;
    }

    return true;
  }

  getDefaultRoute() {
    if (!this.user) return 'dashboard';

    if (this.user.role === 'ADMIN') {
      return 'dashboard';
    }

    switch (this.user.department) {
      case 'ENERGY':
        return 'energy';
      case 'LOGISTICS':
        return 'logistics';
      case 'ENVIRONMENT':
        return 'environment';
      case 'INFRASTRUCTURE':
        return 'infrastructure';
      case 'RESEARCH':
        return 'research';
      default:
        return 'dashboard';
    }
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }
}

export const authService = new AuthService();