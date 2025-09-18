import { track, getRecordedEvents, resetAnalyticsTestState } from './index';

// Ensure __DEV__ definition for test environment if not present
// @ts-expect-error dev
global.__DEV__ = true;

describe('Analytics Track Validation', () => {
  beforeEach(() => {
    resetAnalyticsTestState();
  });

  it('records event with no params when allowed', async () => {
    await track('pr_app_open');
    const events = getRecordedEvents();
    expect(events.length).toBe(1);
    expect(events[0].name).toBe('pr_app_open');
  });

  it('throws on missing required params', async () => {
    await expect(track('pr_pain_log_submit')).rejects.toThrow(/missing param/);
  });

  it('accepts required params', async () => {
    await track('pr_pain_log_submit', { score: 5 });
    const events = getRecordedEvents();
    expect(events[0].params.score).toBe(5);
  });

  it('validates multi-param event', async () => {
    await track('pr_video_start', { video_id: 'v1', pain_area_primary: 'neck' });
    const events = getRecordedEvents();
    expect(events[0].params.video_id).toBe('v1');
  });
});
