import { environment } from '../../environments/environment';

/**
 * New (Phase 1+) endpoints live under /api/v2, but environment.apiUrl still
 * points at /api/v1 for the existing screens. Derive the v2 root from it so
 * there is a single place to change the host.
 */
export const apiV2Url = environment.apiUrl.replace(/\/api\/v1\/?$/, '/api/v2');
