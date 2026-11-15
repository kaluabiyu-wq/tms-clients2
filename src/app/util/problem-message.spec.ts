import { problemMessage } from './problem-message';

describe('problemMessage', () => {
  it('uses the first validation error', () => {
    const err = { status: 400, error: { errors: { Capacity: ['Capacity must be between 1 and 1000.'] } } };
    expect(problemMessage(err)).toBe('Capacity must be between 1 and 1000.');
  });

  it('uses detail for conflicts', () => {
    const err = { status: 409, error: { title: 'Conflict', detail: "A classroom named 'Lab' already exists." } };
    expect(problemMessage(err)).toBe("A classroom named 'Lab' already exists.");
  });

  it('explains 403 and network failures', () => {
    expect(problemMessage({ status: 403 })).toContain('permission');
    expect(problemMessage({ status: 0 })).toContain('reach the server');
  });

  it('falls back when nothing useful is present', () => {
    expect(problemMessage(null)).toBe('Something went wrong. Please try again.');
    expect(problemMessage({ status: 500, error: {} }, 'custom')).toBe('custom');
  });
});
