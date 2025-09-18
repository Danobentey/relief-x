// Analytics Event Definitions (Task 18)
// All event names follow pr_<domain>_<action>

export type AnalyticsEventName =
  | 'pr_app_open'
  | 'pr_onboarding_step_view'
  | 'pr_onboarding_completed'
  | 'pr_auth_login'
  | 'pr_video_start'
  | 'pr_video_complete'
  | 'pr_pain_log_submit'
  | 'pr_paywall_view'
  | 'pr_subscription_begin_trial'
  | 'pr_subscription_convert'
  | 'pr_subscription_expire'
  | 'pr_error';

// Required parameter schemas per event
// Each schema value is an array of required parameter keys.
export const analyticsEventParamMap: Record<AnalyticsEventName, string[]> = {
  pr_app_open: [],
  pr_onboarding_step_view: ['step'],
  pr_onboarding_completed: ['pain_areas_count'],
  pr_auth_login: ['method'],
  pr_video_start: ['video_id', 'pain_area_primary'],
  pr_video_complete: ['video_id', 'duration_sec'],
  pr_pain_log_submit: ['score'],
  pr_paywall_view: ['source'],
  pr_subscription_begin_trial: ['plan'],
  pr_subscription_convert: ['plan'],
  pr_subscription_expire: ['previous_status'],
  pr_error: ['code', 'surface'],
};

export type AnalyticsEventParams = Record<string, unknown>;

export interface AnalyticsDispatchOptions {
  // When true, skip dev environment console logging (silent mode)
  silent?: boolean;
}
